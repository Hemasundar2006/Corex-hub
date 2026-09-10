const Settings = require('../models/Settings');

// @desc    Get store settings (including business WhatsApp number)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        storeName: 'IoT Garage',
        tagline: 'Electronics Components & WhatsApp Ordering',
        businessPhone: process.env.DEFAULT_WHATSAPP_NUMBER || '+919573464809',
        email: 'orders@iotgarage.com',
        address: 'Electronics Hardware Market Complex',
        currencySymbol: '₹',
        orderMessageTemplate:
          'Hello IoT Garage! 👋\nI would like to order:\n📦 Item: {product}\n💰 Price: {currency}{price}\n🏷️ Category: {category}\n🔗 Link: {link}\n\nPlease let me know availability and delivery details!',
      });
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update store settings (Admin only)
// @route   PUT /api/admin/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
  try {
    const {
      storeName,
      tagline,
      businessPhone,
      email,
      address,
      currencySymbol,
      orderMessageTemplate,
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (storeName !== undefined) settings.storeName = storeName.trim();
    if (tagline !== undefined) settings.tagline = tagline.trim();
    if (businessPhone !== undefined) {
      // Clean phone number (keep digits and leading +)
      const cleanPhone = businessPhone.trim().replace(/[^\d+]/g, '');
      settings.businessPhone = cleanPhone;
    }
    if (email !== undefined) settings.email = email.trim();
    if (address !== undefined) settings.address = address.trim();
    if (currencySymbol !== undefined) settings.currencySymbol = currencySymbol.trim();
    if (orderMessageTemplate !== undefined) settings.orderMessageTemplate = orderMessageTemplate;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
