const express = require('express');
const { upload, uploadToCloudinary } = require('../utils/upload');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    const folder = req.body.folder || 'school';
    const url = await uploadToCloudinary(req.file.path, folder);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
