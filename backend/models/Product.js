const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    // Slug for clean, SEO-friendly URLs (e.g., /products/nike-air-max)
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      default: 0,
    },
    // Links this product directly to a category ID
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
    },
    // Main display image URL
    image: {
      type: String,
      required: [true, 'Main product image is required'],
    },
    // Array of strings for extra gallery images
    images: [String],
    // Inventory tracking
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    // Rating and Reviews
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    // Optional: Highlight featured products on the homepage
    isFeatured: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
      enum: ["clothing", "accessories"],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-validate hook to auto-generate a slug from the name if not manually provided
// Mongoose 9 no longer passes a next() callback to pre middleware.
ProductSchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;