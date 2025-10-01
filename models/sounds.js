import mongoose from "mongoose";

const soundSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, Required: true },
  description: { type: String, Required: true },
  tags: {
    type: String,
    enum: ["SoundBite", "Music", "Foley", "SoundEffect", "Ambient"],
  },
});

export default mongoose.model("Sound", soundSchema);
