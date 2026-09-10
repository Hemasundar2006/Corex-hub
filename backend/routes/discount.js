const express = require('express');
const router = express.Router();
const { getDiscount, updateDiscount } = require('../controllers/discountController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/', getDiscount);

// Admin protected route
router.put('/', protect, updateDiscount);

module.exports = router;
