// Booking Routes
// Modified by Saira Shakeel

const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares/user');
const {
  createBookings,
  getBookings,
} = require('../controllers/bookingController');

// 📌 Protected routes - only accessible when logged in
router
  .route('/')
  .get(isLoggedIn, getBookings)     // Get all bookings for logged-in user
  .post(isLoggedIn, createBookings); // Create a new booking

module.exports = router;
