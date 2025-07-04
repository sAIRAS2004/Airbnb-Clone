// User Controller
// Modified by Saira Shakeel

const User = require('../models/User');
const cookieToken = require('../utils/cookieToken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

// 📝 Register/Sign Up user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required',
      });
    }

    // Check if user is already registered
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: 'User already registered!',
      });
    }

    // Create new user
    user = await User.create({ name, email, password });

    // Send token
    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error during registration',
      error: err,
    });
  }
};

// 🔑 Login/Sign In user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required!',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist!',
      });
    }

    const isPasswordCorrect = await user.isValidatedPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Email or password is incorrect!',
      });
    }

    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error during login',
      error: err,
    });
  }
};

// 🔐 Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: 'Name and email are required',
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      user = await User.create({ name, email, password: randomPassword });
    }

    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error during Google login',
      error: err,
    });
  }
};

// 🖼️ Upload Profile Picture
exports.uploadPicture = async (req, res) => {
  const { path } = req.file;
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: 'Airbnb/Users',
    });
    res.status(200).json(result.secure_url);
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error during image upload',
      error,
    });
  }
};

// ✏️ Update User Details
exports.updateUserDetails = async (req, res) => {
  try {
    const { name, password, email, picture } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Update fields based on input
    user.name = name;
    if (picture && !password) {
      user.picture = picture;
    } else if (password && !picture) {
      user.password = password;
    } else if (password && picture) {
      user.picture = picture;
      user.password = password;
    }

    const updatedUser = await user.save();
    cookieToken(updatedUser, res);
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error during user update',
      error,
    });
  }
};

// 🚪 Logout
exports.logout = async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,      // Only send over HTTPS
    sameSite: 'none',  // Allow cross-origin requests
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
};
