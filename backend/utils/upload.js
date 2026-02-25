const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadMiddleware = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for initial upload
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const compressImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 60, progressive: true })
      .toFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error('Compression error:', error);
    throw new Error('Image compression failed: ' + error.message);
  }
};

const uploadToCloudinaryFunc = async (filePath, folder = 'school') => {
  let compressedPath = null;
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    console.log(`File size: ${fileSizeInMB.toFixed(2)}MB`);
    
    let uploadPath = filePath;
    
    // Always compress images larger than 5MB
    if (fileSizeInMB > 5) {
      compressedPath = filePath.replace(/\.[^/.]+$/, '_compressed.jpg');
      uploadPath = await compressImage(filePath, compressedPath);
      console.log('Image compressed');
    }
    
    const result = await cloudinary.uploader.upload(uploadPath, {
      folder: folder,
      resource_type: 'auto',
      quality: 60,
      fetch_format: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 60 }
      ]
    });
    
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
    
    return result.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (compressedPath && fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
    throw error;
  }
};

const uploadToCloudinary = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/temp'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  })
});

const cloudinaryUpload = (req, res, next) => {
  if (!req.file) return next();
  uploadToCloudinaryFunc(req.file.path)
    .then(url => {
      req.file.path = url;
      next();
    })
    .catch(next);
};

module.exports = { upload: uploadMiddleware, uploadToCloudinary, uploadToCloudinaryFunc, cloudinaryUpload };
