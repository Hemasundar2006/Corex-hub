const Product = require('../models/Product');
const Category = require('../models/Category');
const { processImageUpload, deleteImageFile } = require('../middleware/uploadMiddleware');

// @desc    Get all products (public or admin filter)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, featured, inStock, limit = 500, page = 1 } = req.query;
    const query = { isActive: true };

    // If query specifies category (can be slug or ObjectId)
    if (category && category !== 'all') {
      const foundCategory = await Category.findOne({
        $or: [
          { slug: category },
          ...(category.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: category }] : []),
        ],
      });

      if (foundCategory) {
        query.category = foundCategory._id;
      }
    }

    // Search query (case-insensitive name or description)
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (inStock === 'true') {
      query.inStock = true;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug icon');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      imageUrl: directImageUrl,
      inStock,
      isActive,
      featured,
      specifications,
    } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, and category',
      });
    }

    let finalImageUrl = directImageUrl || '';
    let finalPublicId = '';

    // Handle uploaded file if present
    if (req.file) {
      const uploadRes = await processImageUpload(req.file.buffer, req.file.originalname, 'corex_products');
      finalImageUrl = uploadRes.imageUrl;
      finalPublicId = uploadRes.imagePublicId;
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
    }

    // Process specifications array
    let parsedSpecs = [];
    if (specifications) {
      if (Array.isArray(specifications)) {
        parsedSpecs = specifications;
      } else if (typeof specifications === 'string') {
        try {
          parsedSpecs = JSON.parse(specifications);
        } catch {
          parsedSpecs = specifications.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      imageUrl: finalImageUrl,
      imagePublicId: finalPublicId,
      inStock: inStock !== undefined ? inStock === true || inStock === 'true' : true,
      isActive: isActive !== undefined ? isActive === true || isActive === 'true' : true,
      featured: featured !== undefined ? featured === true || featured === 'true' : false,
      specifications: parsedSpecs,
    });

    const populated = await product.populate('category', 'name slug icon');

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populated,
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      category,
      imageUrl: directImageUrl,
      inStock,
      isActive,
      featured,
      specifications,
    } = req.body;

    // Handle new uploaded image
    if (req.file) {
      if (product.imagePublicId) {
        await deleteImageFile(product.imagePublicId);
      }
      const uploadRes = await processImageUpload(req.file.buffer, req.file.originalname, 'corex_products');
      product.imageUrl = uploadRes.imageUrl;
      product.imagePublicId = uploadRes.imagePublicId;
    } else if (directImageUrl && directImageUrl !== product.imageUrl) {
      product.imageUrl = directImageUrl;
    }

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (inStock !== undefined) product.inStock = inStock === true || inStock === 'true';
    if (isActive !== undefined) product.isActive = isActive === true || isActive === 'true';
    if (featured !== undefined) product.featured = featured === true || featured === 'true';

    if (specifications !== undefined) {
      if (Array.isArray(specifications)) {
        product.specifications = specifications;
      } else if (typeof specifications === 'string') {
        try {
          product.specifications = JSON.parse(specifications);
        } catch {
          product.specifications = specifications.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    await product.save();
    const populated = await product.populate('category', 'name slug icon');

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: populated,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete image if existing
    if (product.imagePublicId) {
      await deleteImageFile(product.imagePublicId);
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
