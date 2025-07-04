// Main API Routes
// Modified by Saira Shakeel

const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// 📦 Multer config: store temp uploads in /tmp
const upload = multer({ dest: '/tmp' });

// ✅ Basic test route
router.get('/', (req, res) => {
  res.status(200).json({
    greeting: 'Hello from Airbnb Clone API',
  });
});

// 🌐 Upload photo by image URL
router.post('/upload-by-link', async (req, res) => {
  try {
    const { link } = req.body;

    const result = await cloudinary.uploader.upload(link, {
      folder: 'Airbnb/Places',
    });

    res.json(result.secure_url);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error while uploading image by link',
    });
  }
});

// 💾 Upload photos from local device
router.post('/upload', upload.array('photos', 100), async (req, res) => {
  try {
    const imageArray = [];

    for (let index = 0; index < req.files.length; index++) {
      const { path } = req.files[index];

      const result = await cloudinary.uploader.upload(path, {
        folder: 'Airbnb/Places',
      });

      imageArray.push(result.secure_url);
    }

    res.status(200).json(imageArray);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({
      message: 'Internal server error during image upload',
      error,
    });
  }
});

// 🔗 Route groups
router.use('/user', require('./user'));
router.use('/places', require('./place'));
router.use('/bookings', require('./booking'));

module.exports = router;
