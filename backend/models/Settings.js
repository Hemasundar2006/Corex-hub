const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'IoT Garage',
    },
    tagline: {
      type: String,
      default: 'Electronics Components & WhatsApp Ordering',
    },
    businessPhone: {
      type: String,
      default: '+919573464809',
    },
    email: {
      type: String,
      default: 'orders@iotgarage.com',
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
