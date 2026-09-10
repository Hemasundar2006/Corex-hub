const Promotion = require('../models/Promotion');
const { processImageUpload, deleteImageFile } = require('../middleware/uploadMiddleware');

// @desc    Get promotions/combo offers
// @route   GET /api/promotions
// @access  Public
const getPromotions = async (req, res) => {
  try {
    const { all } = req.query;
    // If all is 'true' (admin view) get everything; otherwise only published
    const filter = all === 'true' ? {} : { isPublished: true };

    const promotions = await Promotion.find(filter).sort({ priority: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: promotions.length,
      promotions,
    });
  } catch (error) {
    console.error('Get promotions error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single promotion
// @route   GET /api/promotions/:id
// @access  Public
const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }
    return res.status(200).json({ success: true, promotion });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create combo offer
// @route   POST /api/admin/promotions
// @access  Private (Admin)
const createPromotion = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      imageUrl: directImageUrl,
      isPublished,
      priority,
      items,
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and price for combo offer',
      });
    }

    let finalImageUrl = directImageUrl || '';
    let finalPublicId = '';

    if (req.file) {
      const uploadRes = await processImageUpload(req.file.buffer, req.file.originalname, 'corex_promotions');
      finalImageUrl = uploadRes.imageUrl;
      finalPublicId = uploadRes.imagePublicId;
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80';
    }

    let parsedItems = [];
    if (items) {
      if (Array.isArray(items)) {
        parsedItems = items;
      } else if (typeof items === 'string') {
        try {
          parsedItems = JSON.parse(items);
        } catch {
          parsedItems = items.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    const promotion = await Promotion.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : 0,
      imageUrl: finalImageUrl,
      imagePublicId: finalPublicId,
      isPublished: isPublished !== undefined ? isPublished === true || isPublished === 'true' : true,
      priority: priority !== undefined ? Number(priority) : 0,
      items: parsedItems,
    });

    return res.status(201).json({
      success: true,
      message: 'Combo offer created successfully',
      promotion,
    });
  } catch (error) {
    console.error('Create promotion error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update combo offer
// @route   PUT /api/admin/promotions/:id
// @access  Private (Admin)
const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Combo offer not found' });
    }

    const {
      title,
      description,
      price,
      originalPrice,
      imageUrl: directImageUrl,
      isPublished,
      priority,
      items,
    } = req.body;

    if (req.file) {
      if (promotion.imagePublicId) {
        await deleteImageFile(promotion.imagePublicId);
      }
      const uploadRes = await processImageUpload(req.file.buffer, req.file.originalname, 'corex_promotions');
      promotion.imageUrl = uploadRes.imageUrl;
      promotion.imagePublicId = uploadRes.imagePublicId;
    } else if (directImageUrl && directImageUrl !== promotion.imageUrl) {
      promotion.imageUrl = directImageUrl;
    }

    if (title !== undefined) promotion.title = title.trim();
    if (description !== undefined) promotion.description = description.trim();
    if (price !== undefined) promotion.price = Number(price);
    if (originalPrice !== undefined) promotion.originalPrice = Number(originalPrice);
    if (isPublished !== undefined) promotion.isPublished = isPublished === true || isPublished === 'true';
    if (priority !== undefined) promotion.priority = Number(priority);

    if (items !== undefined) {
      if (Array.isArray(items)) {
        promotion.items = items;
      } else if (typeof items === 'string') {
        try {
          promotion.items = JSON.parse(items);
        } catch {
          promotion.items = items.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    await promotion.save();

    return res.status(200).json({
      success: true,
      message: 'Combo offer updated successfully',
      promotion,
    });
  } catch (error) {
    console.error('Update promotion error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle publish status of combo offer
// @route   PATCH /api/admin/promotions/:id/toggle
// @access  Private (Admin)
const togglePublish = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Combo offer not found' });
    }

    promotion.isPublished = !promotion.isPublished;
    await promotion.save();

    return res.status(200).json({
      success: true,
      message: `Combo offer ${promotion.isPublished ? 'published' : 'unpublished'}`,
      isPublished: promotion.isPublished,
      promotion,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete combo offer
// @route   DELETE /api/admin/promotions/:id
// @access  Private (Admin)
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Combo offer not found' });
    }

    if (promotion.imagePublicId) {
      await deleteImageFile(promotion.imagePublicId);
    }

    await Promotion.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Combo offer deleted successfully',
    });
  } catch (error) {
    console.error('Delete promotion error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  togglePublish,
  deletePromotion,
};
