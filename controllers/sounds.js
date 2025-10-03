import db from "../db/connection.js";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import Sound from "../models/sounds.js";
import mongoose from "mongoose";
import { Readable } from "stream";

// Get the native MongoDB database instance
let bucket;

// Initialize bucket when connection is ready
db.once("open", () => {
  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "audio" });
  console.log("GridFS bucket initialized");
});

// Use memory storage for multer (we'll handle GridFS manually)
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}).single("audio");

//get all sounds
export const getSounds = async (req, res) => {
  try {
    const sounds = await Sound.find({}).populate("user");
    res.status(200).json(sounds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get one sound
export const getSound = async (req, res) => {
  try {
    const sound = await Sound.findById(req.params.soundId);
    res.status(200).json(sound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//post create sound
// export const createSound = async (req, res) => {
//   try {
//     req.body.user = req.user._id;
//     const newSound = await Sound.create(req.body);
//     newSound._doc.author = req.user;
//     res.status(201).json(newSound);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// POST /sounds
export async function createSound(req, res) {
  try {
    console.log("req.user:", req.user);
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

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
        uploadedBy: req.user?._id || "unknown",
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
      user: req.user?._id,
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

    res.status(201).json(sound);
  } catch (err) {
    console.error("Error creating sound:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
}

// GET /sounds/:soundId/stream
export async function streamSound(req, res) {
  try {
    const sound = await Sound.findById(req.params.soundId);
    if (!sound) return res.status(404).json({ error: "Not found" });

    if (!bucket) {
      return res.status(500).json({ error: "GridFS bucket not initialized" });
    }

    res.set("Content-Type", sound.contentType || "audio/mpeg");
    bucket
      .openDownloadStream(sound.fileId)
      .on("error", () => res.sendStatus(404))
      .pipe(res);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Invalid id" });
  }
}

//put update sound
export const updateSound = async (req, res) => {
  try {
    const sound = await Sound.findById(req.params.soundId);
    if (!sound) {
      return res.status(404).json({ error: "Sound not found" });
    }
    if (!sound.user.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const updatedSound = await Sound.findByIdAndUpdate(
      req.params.soundId,
      req.body,
      { new: true }
    );
    updatedSound._doc.author = req.user;
    res.status(200).json(updatedSound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete sound
export const deleteSound = async (req, res) => {
  try {
    const sound = await Sound.findById(req.params.soundId);
    if (!sound) {
      return res.status(404).json({ error: "Sound not found" });
    }
    if (!sound.user.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const deletedSound = await Sound.findByIdAndDelete(req.params.soundId);
    res.status(200).json(deletedSound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
