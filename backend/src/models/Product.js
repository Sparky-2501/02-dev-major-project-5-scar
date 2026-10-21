import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  size: { type: String, default: 'Standard' },
  color: { type: String, default: 'Classic' },
  stock: { type: Number, default: 10, min: 0 },
  price: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, sparse: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['men', 'women', 'accessories', 'footwear', 'electronics', 'kids', 'home', 'other'],
    },
    genderFocus: {
      type: String,
      enum: ['female', 'male', 'unisex'],
      default: 'unisex',
    },
    brand: { type: String, default: 'SCAR Atelier', trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 24 },
    description: { type: String, default: '', trim: true },
    thumbnail: { type: String, default: '/images/products/women/women_1.svg' },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    variants: [variantSchema],
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Helpful index for queries
productSchema.index({ category: 1, genderFocus: 1, isArchived: 1 });

export const Product = mongoose.model('Product', productSchema);
