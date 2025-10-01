import Sounds from "../models/sounds.js";

//all sounds
export const getSounds = async (req, res) => {
  try {
    const sounds = await Sounds.find({}).populate("user");
    res.status(200).json(sounds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// one sound
export const getSound = async (req, res) => {
  try {
    const sound = await Sounds.findById(req.params.soundId);
    res.status(200).json(sound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSound = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const newSound = await Sounds.create(req.body);
    newSound._doc.author = req.user;
    res.status(201).json(newSound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
