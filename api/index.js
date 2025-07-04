// Airbnb Clone Server Configuration
// Modified by Saira Shakeel

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectWithDB = require("./config/db");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

// ✅ Connect with MongoDB
connectWithDB();

// ☁️ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// 🍪 Parse cookies from client
app.use(cookieParser());

// 🔐 Session management
app.use(
  cookieSession({
    name: "session",
    maxAge: process.env.COOKIE_TIME * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
    secure: true,     // Only over HTTPS
    sameSite: "none", // Allow cross-origin cookies
    httpOnly: true,   // Only accessible server-side
  })
);

// 🧠 Middleware to handle JSON
app.use(express.json());

// 🌐 Enable CORS for frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// 🛣️ API routes
app.use("/", require("./routes"));

// 🚀 Start server
app.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    console.log("Error in connecting to server:", err);
  } else {
    console.log(`Server is running on port ${process.env.PORT}`);
  }
});

module.exports = app;
