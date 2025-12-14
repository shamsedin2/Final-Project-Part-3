const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filtering
    const where = {};
    if (req.query.minPrice) {
      where.price = { ...where.price, [Op.gte]: req.query.minPrice };
    }
    if (req.query.maxPrice) {
      where.price = { ...where.price, [Op.lte]: req.query.maxPrice };
    }

    // Search
    if (req.query.search) {
      where.name = { [Op.iLike]: `%${req.query.search}%` };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (authenticated users)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (owner or admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership (already handled by middleware, but double-check)
    if (product.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const { name, description, price, stock } = req.body;

    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      stock: stock !== undefined ? stock : product.stock
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (owner or admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};