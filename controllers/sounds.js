import { Readable } from 'stream';
import Sound from '../models/sounds.js'; // Adjust path as needed
import { bucket } from '../config/gridfs.js';
import multer from 'multer';
import { ObjectId } from 'mongodb';

// Configure multer for file uploads
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
}).single('audio');

export async function createSound(req, res) {
  try {
    console.log("req.user:", req.user);
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    // ✅ Check authentication first
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.file)
      return res.status(400).json({ error: "Missing 'audio' file" });

    if (!bucket) {
      return res.status(500).json({
        error: "GridFS bucket not initialized yet. Please try again.",
      });
    }

    const { title, description, tags } = req.body;

    // Create a readable stream from the buffer
    const readableStream = Readable.from(req.file.buffer);

    // Generate filename
    const filename = `${Date.now()}-${req.file.originalname}`;

    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype || "audio/mpeg",
      metadata: {
        uploadedBy: req.user._id,
        originalName: req.file.originalname,
      },
    });

    // Pipe the file to GridFS
    readableStream.pipe(uploadStream);

    // Wait for upload to complete
    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    console.log("File uploaded to GridFS with ID:", uploadStream.id);

    // Parse tags if they exist
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (err) {
        console.warn("Invalid tags JSON, defaulting to empty array");
      }
    }
    console.log("Parsed tags array:", parsedTags);

    // Create Sound document with GridFS file info
    const sound = await Sound.create({
      user: req.user._id,
      title,
      description,
      tags: parsedTags,
      fileId: uploadStream.id,
      filename: filename,
      contentType: req.file.mimetype || "audio/mpeg",
      length: req.file.size,
      uploadDate: new Date(),
      bucketName: "audio",
    });

    // ✅ Populate the user field before returning
    await sound.populate('user');

    res.status(201).json(sound);
  } catch (err) {
    console.error("Error creating sound:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
}

export async function streamSoundFile(req, res) {
  try {
    const { fileId } = req.params;
    
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    const objectId = new ObjectId(fileId);
    
    // Create download stream from GridFS
    const downloadStream = bucket.openDownloadStream(objectId);
    
    // Handle stream errors
    downloadStream.on('error', (error) => {
      console.error('GridFS download error:', error);
      if (!res.headersSent) {
        res.status(404).json({ error: 'File not found' });
      }
    });

    // Set appropriate headers for audio streaming
    res.set({
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache'
    });

    // Pipe the file to the response
    downloadStream.pipe(res);
    
  } catch (error) {
    console.error('Error streaming sound file:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to stream file' });
    }
  }
}

export async function getAllSounds(req, res) {
  try {
    const sounds = await Sound.find().populate('user', 'username');
    res.json(sounds);
  } catch (error) {
    console.error('Error fetching sounds:', error);
    res.status(500).json({ error: 'Failed to fetch sounds' });
  }
}

export async function getSoundById(req, res) {
  try {
    const { id } = req.params;
    const sound = await Sound.findById(id).populate('user', 'username');
    
    if (!sound) {
      return res.status(404).json({ error: 'Sound not found' });
    }
    
    res.json(sound);
  } catch (error) {
    console.error('Error fetching sound:', error);
    res.status(500).json({ error: 'Failed to fetch sound' });
  }
}

export async function deleteSound(req, res) {
  try {
    const { id } = req.params;
    const sound = await Sound.findById(id);
    
    if (!sound) {
      return res.status(404).json({ error: 'Sound not found' });
    }
    
    // Check if user owns the sound
    if (sound.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this sound' });
    }
    
    // Delete from GridFS
    if (sound.fileId) {
      try {
        await bucket.delete(new ObjectId(sound.fileId));
      } catch (gridfsError) {
        console.error('Error deleting from GridFS:', gridfsError);
      }
    }
    
    // Delete sound document
    await Sound.findByIdAndDelete(id);
    
    res.json({ message: 'Sound deleted successfully' });
  } catch (error) {
    console.error('Error deleting sound:', error);
    res.status(500).json({ error: 'Failed to delete sound' });
  }
}

// Additional functions expected by routes
export const getSounds = getAllSounds; // Alias for getAllSounds
export const getSound = getSoundById; // Alias for getSoundById

export async function streamSound(req, res) {
  try {
    const { soundId } = req.params;
    const sound = await Sound.findById(soundId);
    
    if (!sound) {
      return res.status(404).json({ error: 'Sound not found' });
    }
    
    // Redirect to the file streaming endpoint
    return streamSoundFile({ params: { fileId: sound.fileId } }, res);
  } catch (error) {
    console.error('Error streaming sound:', error);
    res.status(500).json({ error: 'Failed to stream sound' });
  }
}

export async function updateSound(req, res) {
  try {
    const { soundId } = req.params;
    const { title, description, tags } = req.body;
    
    const sound = await Sound.findById(soundId);
    
    if (!sound) {
      return res.status(404).json({ error: 'Sound not found' });
    }
    
    // Check if user owns the sound
    if (sound.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this sound' });
    }
    
    // Parse tags if they exist
    let parsedTags = sound.tags;
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (err) {
        console.warn("Invalid tags JSON, keeping existing tags");
      }
    }
    
    const updatedSound = await Sound.findByIdAndUpdate(
      soundId,
      {
        title: title || sound.title,
        description: description || sound.description,
        tags: parsedTags
      },
      { new: true }
    ).populate('user', 'username');
    
    res.json(updatedSound);
  } catch (error) {
    console.error('Error updating sound:', error);
    res.status(500).json({ error: 'Failed to update sound' });
  }
}