import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../configs/utils.js";
import cloudinary from "../configs/cloudinary.js";

const formatUserResponse = (user, token) => {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic || "default-profile.png",
    role: user.role,
    token: token || null,
  };
};

// Signup controller
export const signup = async (req, res) => {
  // signup logic
  try {
    // first we need to get signup data from body
    const { fullName, email, password, role } = req.body;

    //validate fields are empty
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // validate if password length is < 6
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be in 6 digit" });

    // check if user already exist or not
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Email already registered" });

    //hash password
    const salt = await bcrypt.genSalt(10); /// generate 10 number string
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (role) newUser.role = role;

    // if user save so generate jwt token
    if (newUser) {
      // generate jwt token
      const token = generateToken(newUser._id, res); // create jwt token
      await newUser.save();

      res.status(201).json(formatUserResponse(newUser, token));
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error - ${error}` });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if email is in DB or not
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User Not found" });

    // if User is there So check password if correct or not
    const isPassworsCorrect = await bcrypt.compare(password, user.password);

    // if password does not match return - false
    if (!isPassworsCorrect)
      return res.status(400).json({ message: "Wrong Email or Password" });

    // if everything is right generate new token if signup token override it
    const token = generateToken(user._id, res);

    res.status(201).json(formatUserResponse(user, token));
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error ${error.message}` });
  }
};

// LOGOUT
// in-memory token blacklist
const blacklishedTokens = [];
export const logout = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    // if token is there so blacklished token
    if (token) {
      blacklishedTokens.push(token);
    }
    res
      .status(200)
      .json({
        message: "tis is backend --- You have been logged out from backend",
      });
  } catch (error) {
    res.status(500).json({ message: `internal error ${error.message}` });
  }
};
export const isTokenBlacklished = (token) => {
  return blacklishedTokens.includes(token);
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, email, password } = req.body;

    const updatedData = {};
    if (fullName) updatedData.fullName = fullName;
    if (email) updatedData.email = email;

    // ✅ Handle password update
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }

    // ✅ Handle profile picture (Cloudinary)
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profilepics" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      updatedData.profilePic = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

if (!updatedUser) return res.status(404).json({ message: "User not found" });

res.status(200).json(formatUserResponse(updatedUser, null));

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/// check current user
export const checkUser = (req, res) => {
  try {
    const user = res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ error: `Internal error ${error}` });
  }
};

/// get All USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: `Internal error ${error}` });
  }
};
