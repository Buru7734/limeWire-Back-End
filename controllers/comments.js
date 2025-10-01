import Comment from "../models/comments.js";

//Create
export const createComment = async (req, res) => {
  try {
    const data = await Comment.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

//Get
export const getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ err: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

//Delete
export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    if (!deletedComment) {
      return res.status(404).json({ err: "Comment not found" });
    }
    res.json(deletedComment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
//Update
export const updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedComment) {
      return res.status(404).json({ err: "Comment not found" });
    }
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
