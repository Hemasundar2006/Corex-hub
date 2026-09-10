const express = require('express');
const router = express.Router();
const {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  togglePublish,
  deletePromotion,
} = require('../controllers/promotionController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getPromotions);
router.get('/:id', getPromotionById);

// Admin protected routes
router.post('/', protect, upload.single('image'), createPromotion);
router.put('/:id', protect, upload.single('image'), updatePromotion);
router.patch('/:id/toggle', protect, togglePublish);
router.delete('/:id', protect, deletePromotion);

module.exports = router;
