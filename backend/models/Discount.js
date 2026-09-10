const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Discount message text is required'],
      trim: true,
    },
    badgeText: {
      type: String,
      default: 'Special Offer',
      trim: true,
    },
    linkUrl: {
      type: String,
      default: '/products',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Discount', discountSchema);
