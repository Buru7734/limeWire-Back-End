import mongoose from "mongoose";

const soundSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, Required: true },
    description: { type: String, Required: true },
    tags: [
      {
        type: String,
        enum: ["Sound Bite", "Music", "Foley", "Sound Effect", "Ambient"],
      },
    ],

    // ---- GridFS linkage fields ----
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    filename: { type: String, required: true },
    contentType: { type: String, default: "audio/mpeg" },
    length: { type: Number }, // bytes
    uploadDate: { type: Date },
    bucketName: { type: String, default: "audio" },
  },
  { timestamps: true }
);

export default mongoose.model("Sound", soundSchema);
