const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Ensure uploads folder exists for local fallback
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

/**
 * Uploads a file buffer to Cloudinary or saves locally if Cloudinary is not configured
 * @param {Buffer} buffer 
 * @param {string} originalname 
 * @param {string} folder 
 * @returns {Promise<{imageUrl: string, imagePublicId: string}>}
 */
const processImageUpload = async (buffer, originalname, folder = 'corex_products') => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          format: 'webp',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            imageUrl: result.secure_url,
            imagePublicId: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  } else {
    // Local fallback
    const ext = path.extname(originalname) || '.webp';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    return {
      imageUrl: `/uploads/${filename}`,
      imagePublicId: filename,
    };
  }
};

/**
 * Removes an image from Cloudinary or local disk
 * @param {string} publicId 
 */
const deleteImageFile = async (publicId) => {
  if (!publicId) return;

  if (isCloudinaryConfigured()) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn('Could not delete Cloudinary image:', err.message);
    }
  } else {
    try {
      const filePath = path.join(uploadsDir, publicId);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (err) {
      console.warn('Could not delete local image file:', err.message);
    }
  }
};

module.exports = {
  upload,
  processImageUpload,
  deleteImageFile,
};
