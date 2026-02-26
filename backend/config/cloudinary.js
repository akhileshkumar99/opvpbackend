const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mediaflows_4c9982',
  api_key: process.env.CLOUDINARY_API_KEY || '898167593351275',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'eLactmvZs8D7t8Cg5RvW6JCQmg8'
});

module.exports = cloudinary;
