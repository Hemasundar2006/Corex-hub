const Category = require('../models/Category');
const Product = require('../models/Product');

// Helper to generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// @desc    Get all categories with product counts
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Aggregate active products per category
    const productCounts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    productCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat.toObject(),
      productCount: countMap[cat._id.toString()] || 0,
    }));

    return res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const count = await Product.countDocuments({ category: category._id, isActive: true });

    return res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        productCount: count,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const finalSlug = slug ? slugify(slug) : slugify(name);

    // Check if category or slug already exists
    const existing = await Category.findOne({
      $or: [{ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } }, { slug: finalSlug }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      description: description ? description.trim() : '',
      icon: icon || 'Cpu',
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: {
        ...category.toObject(),
        productCount: 0,
      },
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, slug, description, icon } = req.body;

    if (name) category.name = name.trim();
    if (slug) category.slug = slugify(slug);
    if (description !== undefined) category.description = description.trim();
    if (icon) category.icon = icon;

    await category.save();

    const count = await Product.countDocuments({ category: category._id, isActive: true });

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: {
        ...category.toObject(),
        productCount: count,
      },
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Safeguard check: cannot delete if products are assigned
    const assignedProductsCount = await Product.countDocuments({ category: category._id });
    if (assignedProductsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}". It currently has ${assignedProductsCount} product(s) assigned to it. Please reassign or delete those products first.`,
        assignedProductsCount,
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
