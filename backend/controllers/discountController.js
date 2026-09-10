const Discount = require('../models/Discount');

// @desc    Get current discount banner
// @route   GET /api/discount
// @access  Public
const getDiscount = async (req, res) => {
  try {
    let discount = await Discount.findOne();
    if (!discount) {
      discount = await Discount.create({
        text: 'Special Monsoon Student Offer: Flat 10% OFF on all Arduino & Sensor Modules! Order directly on WhatsApp.',
        badgeText: 'Limited Deal',
        linkUrl: '/products?category=sensors-modules',
        isActive: true,
      });
    }

    return res.status(200).json({
      success: true,
      discount,
    });
  } catch (error) {
    console.error('Get discount error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update discount banner (or toggle isActive)
// @route   PUT /api/admin/discount
// @access  Private (Admin)
const updateDiscount = async (req, res) => {
  try {
    const { text, badgeText, linkUrl, isActive } = req.body;

    let discount = await Discount.findOne();
    if (!discount) {
      discount = new Discount({
        text: text || 'Special Offer',
        badgeText: badgeText || 'Offer',
        linkUrl: linkUrl || '/products',
        isActive: isActive !== undefined ? isActive : true,
      });
    } else {
      if (text !== undefined) discount.text = text.trim();
      if (badgeText !== undefined) discount.badgeText = badgeText.trim();
      if (linkUrl !== undefined) discount.linkUrl = linkUrl.trim();
      if (isActive !== undefined) discount.isActive = isActive === true || isActive === 'true';
    }

    await discount.save();

    return res.status(200).json({
      success: true,
      message: 'Discount banner updated successfully',
      discount,
    });
  } catch (error) {
    console.error('Update discount error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDiscount,
  updateDiscount,
};
