import Sounds from "../models/sounds.js";

//get all sounds
export const getSounds = async (req, res) => {
  try {
    const sounds = await Sounds.find({}).populate("user");
    res.status(200).json(sounds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get one sound
export const getSound = async (req, res) => {
  try {
    const sound = await Sounds.findById(req.params.soundId);
    res.status(200).json(sound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//post create sound
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

//put update sound
export const updateSound = async (req, res) => {
  try {
    const sound = await Sounds.findById(req.params.soundId);
    if (sound.user.equals(req.body._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const updatedSound = await Sounds.findByIdAndUpdate(
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
    const sound = await Sounds.findById(req.params.soundId);

    if (sound.user.equals(req.body._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const deletedSound = await Sounds.findByIdAndDelete(req.params.soundId);
    res.status(200).json(deletedSound);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
