// Auth Middleware - isLoggedIn
// Modified by Saira Shakeel

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and attach user to request
exports.isLoggedIn = async (req, res, next) => {
  // Get token from cookies or Authorization header
  const token =
    req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Login first to access this page',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};
