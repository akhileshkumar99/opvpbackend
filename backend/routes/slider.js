const express = require('express');
const Slider = require('../models/Slider');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../utils/upload');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const imageUrl = await uploadToCloudinary(req.file.path, 'school/slider');
    const slider = await Slider.create({ imageUrl });
    res.status(201).json(slider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slider deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
