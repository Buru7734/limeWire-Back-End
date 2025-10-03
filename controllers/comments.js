import Comment from "../models/comments.js";

//Create
export const createComment = async (req, res) => {
  try {
    // Add the user from the verified token
    const commentData = {
      ...req.body,
      user: req.user._id // This comes from your verifyToken middleware
    };
    const data = await Comment.create(commentData);
    
    // Populate the user before returning
    const populatedComment = await Comment.findById(data._id).populate('user', 'username');
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const getSoundComments = async (req, res) => {
  try {
    const comments = await Comment.find({ sound: req.query.sound })
      .populate('user', 'username') 
      .sort({ createdAt: -1 }); 
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//Get
export const getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate('user', 'username'); // Add population here too

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
