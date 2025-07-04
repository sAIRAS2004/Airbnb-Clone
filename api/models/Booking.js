// Booking Model Schema
// Modified by Saira Shakeel

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Reference to the user who made the booking
    required: true,
  },
  place: {
    type: mongoose.Schema.ObjectId,
    ref: "Place", // Reference to the booked place
    required: true,
  },
  checkIn: {
    type: Date, // Check-in date
    required: true,
  },
  checkOut: {
    type: Date, // Check-out date
    required: true,
  },
  name: {
    type: String, // Guest name
    required: true,
  },
  phone: {
    type: String, // Guest phone number
    required: true,
  },
  price: {
    type: Number, // Total price for the booking
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
