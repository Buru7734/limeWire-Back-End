import User from "../models/user.js";
import Sound from "../models/sounds.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username");

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    // if (req.user._id !== req.params.userId) {
    //   return res.status(403).json({ err: "Unauthorized" });
    // }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: "User not found." });
    }
    const sounds = await Sound.find({ user: req.params.userId });

   res.json({ ...user.toObject(), sounds });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log("UserId: ", req.params.userId);
    const user = await User.findByIdAndDelete(req.params.userId);

    console.log("User deleted: ", user);

    if (!user) {
      return res.status(404).json({ err: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ err: err.message });
  }
};
