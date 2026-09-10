const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Corex Projects Hub',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Your One-Stop Electronics Components & Project Supplies Hub',
      trim: true,
    },
    businessPhone: {
      type: String,
      default: '+919876543210',
      trim: true,
    },
    email: {
      type: String,
      default: 'contact@corexprojects.com',
      trim: true,
    },
    address: {
      type: String,
      default: 'Shop #14, Electronics Market Complex, Tech Road, City Center',
      trim: true,
    },
    currencySymbol: {
      type: String,
      default: '₹',
      trim: true,
    },
    orderMessageTemplate: {
      type: String,
      default: 'Hello Corex Projects Hub! 👋\nI would like to order:\n📦 Item: {product}\n💰 Price: {currency}{price}\n🏷️ Category: {category}\n🔗 Link: {link}\n\nPlease let me know availability and payment/delivery details!',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
