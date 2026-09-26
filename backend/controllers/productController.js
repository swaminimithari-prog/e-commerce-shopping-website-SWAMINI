// controllers/productController.js
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    // category can be passed either as a real Category ObjectId or as a
    // slug/name (e.g. "men", "women"). Resolve slugs to the ObjectId here
    // so old frontend calls like ?category=men don't crash Product.find().
    let categoryFilter = {};
    if (req.query.category) {
      const rawCategory = req.query.category;

      if (mongoose.Types.ObjectId.isValid(rawCategory)) {
        categoryFilter = { category: rawCategory };
      } else {
        const matchedCategory = await Category.findOne({
          $or: [{ slug: rawCategory.toLowerCase() }, { name: rawCategory }],
        });

        // No matching category -> return an empty result set instead of
        // letting an invalid ObjectId cast crash the query.
        categoryFilter = { category: matchedCategory ? matchedCategory._id : null };
      }
    }

    const typeFilter = req.query.type
      ? { type: req.query.type }
      : {};

    const products = await Product.find({
      ...keyword,
      ...categoryFilter,
      ...typeFilter,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, type, brand, countInStock, image } = req.body;

    if (!name || !description || !price || !category || !type || countInStock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      type,
      brand,
      countInStock,
      image,
      user: req.user.id,
    });

    const populated = await product.populate("category", "name slug");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populated,
    });
  } catch (error) {
    console.error("createProduct error:", error);

    // Duplicate slug/name (MongoDB unique index violation)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A product with this name already exists. Try a slightly different title.",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, countInStock, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.countInStock = countInStock ?? product.countInStock;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    const populated = await updatedProduct.populate("category", "name slug");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};