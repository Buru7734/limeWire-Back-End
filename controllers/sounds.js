import db from "../db/connection.js";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { GridFSBucket } from "mongodb";
import Sound from "../models/sounds.js";

const dbPromise = db.asPromise().then((conn) => conn.getClient().db());

// Bucket depends on the same native Db. Build it lazily when needed.
async function getBucket() {
  const db = await dbPromise;
  return new GridFSBucket(db, { bucketName: "audio" });
}

// Configure storage with a Promise<Db>. This prevents the f === undefined issue.
const storage = new GridFsStorage({
  db: dbPromise, // ✅ the library will await this
  file: (req, file) => ({
    bucketName: "audio",
    filename: `${Date.now()}-${file.originalname}`,
    metadata: { uploadedBy: req.user?._id || "unknown" },
  }),
});

export const uploadMiddleware = multer({ storage }).single("audio");

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
    if (!req.file)
      return res.status(400).json({ error: "Missing 'audio' file" });

    const { title, description, tags } = req.body;

    const sound = await Sound.create({
      user: req.user?._id, // verifyToken should set req.user
      title,
      description,
      tags,

      fileId: req.file.id, // GridFS _id
      filename: req.file.filename,
      contentType: req.file.contentType || req.file.mimetype || "audio/mpeg",
      length: req.file.size,
      uploadDate: req.file.uploadDate,
      bucketName: req.file.bucketName || "audio",
    });

    res.status(201).json(sound);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
}

// GET /sounds/:soundId/stream
export async function streamSound(req, res) {
  try {
    const sound = await Sound.findById(req.params.soundId);
    if (!sound) return res.status(404).json({ error: "Not found" });

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
    if (sound.user.equals(req.body._id)) {
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

    if (sound.user.equals(req.body._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const deletedSound = await Sound.findByIdAndDelete(req.params.soundId);
    res.status(200).json(deletedSound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
