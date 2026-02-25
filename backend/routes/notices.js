const express = require('express');
const Notice = require('../models/Notice');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinaryFunc } = require('../utils/upload');

const router = express.Router();

// @route   GET /api/notices
// @desc    Get all notices
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { noticeType, isPublic, isActive } = req.query;
    let query = {};

    if (isActive !== 'false') query.isActive = true;
    if (isPublic) query.isPublic = isPublic === 'true';
    if (noticeType) query.noticeType = noticeType;

    const notices = await Notice.find(query)
      .populate('createdBy', 'name')
      .sort({ publishDate: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/notices/public
// @desc    Get public notices
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const notices = await Notice.find({
      isActive: true,
      isPublic: true,
      $or: [
        { expiryDate: { $gte: new Date() } },
        { expiryDate: null }
      ]
    })
      .sort({ publishDate: -1 })
      .limit(10);
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/notices/:id
// @desc    Get single notice
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('createdBy', 'name');
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/notices
// @desc    Create notice
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const noticeData = {
      title: req.body.title,
      description: req.body.description,
      noticeType: req.body.noticeType || 'General',
      createdBy: req.user._id
    };
    
    if (req.body.publishDate) noticeData.publishDate = req.body.publishDate;
    if (req.body.expiryDate) noticeData.expiryDate = req.body.expiryDate;
    
    if (req.file) {
      const imageUrl = await uploadToCloudinaryFunc(req.file.path, 'school/notices');
      noticeData.image = imageUrl;
    }
    
    const notice = await Notice.create(noticeData);
    res.status(201).json(notice);
  } catch (error) {
    console.error('Notice creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/notices/:id
// @desc    Update notice
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/notices/:id
// @desc    Delete notice
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    await notice.deleteOne();
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
