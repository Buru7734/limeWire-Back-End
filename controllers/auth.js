import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Constants
const SALT_ROUNDS = 12;

const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

// JWT signing options
const JWT_OPTIONS = {
  expiresIn: JWT_EXPIRES_IN,
};

export const signUp = async (req, res) => {
  try {
    // Input validation
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ err: "Username and password are required." });
    }
    
    const userInDatabase = await User.findOne({ username: username.trim() });

    if (userInDatabase) {
      return res.status(409).json({ err: "Username already taken." });
    }

    const user = await User.create({
      username: username.trim(),
      hashedPassword: bcrypt.hashSync(password, SALT_ROUNDS),
    });

    const payload = { username: user.username, _id: user._id };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const signIn = async (req, res) => {
  try {
    // Input validation
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ err: "Username and password are required." });
    }
    
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ err: "Invalid credentials." });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: "Invalid credentials." });
    }

    const payload = { username: user.username, _id: user._id };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
