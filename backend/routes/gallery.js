const express = require('express');
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinaryFunc } = require('../utils/upload');

const router = express.Router();

// @route   GET /api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, isActive } = req.query;
    let query = {};

    if (category) query.category = category;
    if (isActive !== 'false') query.isActive = true;

    const gallery = await Gallery.find(query).sort({ date: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/gallery/:id
// @desc    Get single gallery image
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/gallery
// @desc    Add gallery image
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    console.log('File received:', req.file.filename);
    const imageUrl = await uploadToCloudinaryFunc(req.file.path, 'school/gallery');
    console.log('Upload successful:', imageUrl);
    
    const gallery = await Gallery.create({ ...req.body, imageUrl });
    res.status(201).json(gallery);
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update gallery image
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }
    res.json(gallery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }
    await gallery.deleteOne();
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
