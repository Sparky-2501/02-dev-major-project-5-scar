import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    bannerImage: { type: String, default: '/images/products/women/women_1.svg' },
    mobileBannerImage: { type: String, default: '' },
    type: {
      type: String,
      enum: ['all', 'category', 'products', 'banner_only', 'marquee'],
      default: 'category',
    },
    targetCategory: { type: String, default: 'all' },
    genderTarget: {
      type: String,
      enum: ['female', 'male', 'all'],
      default: 'all',
    },
    targetProductSkus: { type: [String], default: [] },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, default: 3000 },
    minOrderValue: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days default
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'expired', 'scheduled', 'draft'],
      default: 'active',
    },
    priority: { type: Number, default: 5 },
    ctaText: { type: String, default: 'Explore Collection' },
    ctaUrl: { type: String, default: '/catalog' },
    marqueeEnabled: { type: Boolean, default: false },
    marqueeText: { type: String, default: '' },
    createdBy: { type: String, default: 'Administrator' },
    approvedBy: { type: String, default: 'System Administrator' },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

bannerSchema.index({ status: 1, priority: -1, startDate: 1, endDate: 1 });

export const Banner = mongoose.model('Banner', bannerSchema);
