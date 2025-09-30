import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  sound: { type: mongoose.Schema.Types.ObjectId, ref: "Sound" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment_text: { Type: String, Required: true },
});

export default mongoose.model("Comment", commentSchema);
