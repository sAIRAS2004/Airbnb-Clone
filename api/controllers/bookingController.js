// Booking Controller
// Modified by Saira Shakeel

const Booking = require('../models/Booking');

// Create a new booking
exports.createBookings = async (req, res) => {
  try {
    const userData = req.user;
    const { place, checkIn, checkOut, numOfGuests, name, phone, price } = req.body;

    const booking = await Booking.create({
      user: userData.id,
      place,
      checkIn,
      checkOut,
      numOfGuests,
      name,
      phone,
      price,
    });

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error while creating booking',
      error: err,
    });
  }
};

// Get bookings for a specific user
exports.getBookings = async (req, res) => {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(401).json({
        error: 'Unauthorized: Access denied',
      });
    }

    const booking = await Booking.find({ user: userData.id }).populate('place');

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error while fetching bookings',
      error: err,
    });
  }
};
