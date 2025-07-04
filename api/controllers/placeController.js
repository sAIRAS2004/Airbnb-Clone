// Place Controller
// Modified by Saira Shakeel

const Place = require('../models/Place');

// ➕ Add a new place
exports.addPlace = async (req, res) => {
  try {
    const userData = req.user;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    } = req.body;

    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    });

    res.status(200).json({ success: true, place });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error while adding place',
      error: err,
    });
  }
};

// 👤 Get places added by logged-in user
exports.userPlaces = async (req, res) => {
  try {
    const userData = req.user;
    const id = userData.id;

    const places = await Place.find({ owner: id });
    res.status(200).json({ success: true, places });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error while fetching user places',
      error: err,
    });
  }
};

// ✏️ Update a place
exports.updatePlace = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;

    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    } = req.body;

    const place = await Place.findById(id);
    if (userId === place.owner.toString()) {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        maxGuests,
        price,
      });
      await place.save();
      res.status(200).json({
        message: 'Place updated successfully!',
      });
    } else {
      res.status(403).json({
        message: 'You are not authorized to update this place',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error while updating place',
      error: err,
    });
  }
};

// 🌍 Get all places
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json({ success: true, places });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error while fetching all places',
      error: err,
    });
  }
};

// 🔍 Get single place by ID
exports.singlePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.status(200).json({ success: true, place });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error while fetching single place',
      error: err,
    });
  }
};

// 🔎 Search for places by address
exports.searchPlaces = async (req, res) => {
  try {
    const searchword = req.params.key;

    if (searchword === '') {
      const allPlaces = await Place.find();
      return res.status(200).json({ success: true, places: allPlaces });
    }

    const searchMatches = await Place.find({
      address: { $regex: searchword, $options: 'i' },
    });

    res.status(200).json({ success: true, places: searchMatches });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error while searching for places',
      error: err,
    });
  }
};
