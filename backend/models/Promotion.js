const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Combo offer title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Combo offer price is required'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, 'Combo offer image URL is required'],
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0, // Higher numbers appear first
    },
    items: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Promotion', promotionSchema);
