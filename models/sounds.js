import mongoose from "mongoose";

const soundSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { Type: String, Required: true },
  description: { Type: String, Required: true },
  tags: {
    Type: String,
    enum: ["SoundBite", "Music", "Foley", "SoundEffect", "Ambient"],
  },
});

export default mongoose.model("Sound", soundSchema);
