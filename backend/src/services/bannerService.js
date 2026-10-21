import mongoose from 'mongoose';
import { Banner } from '../models/Banner.js';
import { SEED_BANNERS } from '../data/seedBanners.js';
import { logger } from '../utils/logger.js';

class BannerService {
  constructor() {
    this.memoryBanners = new Map();
    // Pre-populate memory store with seed banners
    SEED_BANNERS.forEach((item) => {
      this.memoryBanners.set(item.id, { ...item });
    });
  }

  isDbConnected() {
    return mongoose.connection.readyState === 1;
  }

  async ensureSeeded() {
    if (!this.isDbConnected()) return;
    try {
      const count = await Banner.countDocuments();
      if (count === 0) {
        logger.info('🎨 MongoDB Banner collection is empty. Seeding discount banners...');
        for (const b of SEED_BANNERS) {
          await Banner.create({
            id: b.id,
            name: b.name,
            headline: b.headline,
            description: b.description,
            bannerImage: b.bannerImage,
            mobileBannerImage: b.mobileBannerImage,
            type: b.type,
            targetCategory: b.targetCategory,
            genderTarget: b.genderTarget || 'all',
            discountType: b.discountType,
            discountValue: b.discountValue,
            maxDiscount: b.maxDiscount,
            minOrderValue: b.minOrderValue,
            startDate: new Date(b.startDate),
            endDate: new Date(b.endDate),
            status: b.status,
            priority: b.priority,
            ctaText: b.ctaText,
            ctaUrl: b.ctaUrl,
            marqueeEnabled: b.marqueeEnabled,
            marqueeText: b.marqueeText,
            createdBy: b.createdBy,
            approvedBy: b.approvedBy,
            impressions: b.impressions || 0,
            clicks: b.clicks || 0,
          });
        }
        logger.info('✨ Seeded promotional discount banners successfully into MongoDB.');
      }
    } catch (err) {
      logger.warn(`Could not seed banners into MongoDB: ${err.message}`);
    }
  }

  async getAll({ status, gender } = {}) {
    let items = [];

    if (this.isDbConnected()) {
      try {
        const query = {};
        if (status) query.status = status;
        if (gender && gender !== 'all') {
          query.$or = [{ genderTarget: gender }, { genderTarget: 'all' }];
        }
        const docs = await Banner.find(query).sort({ priority: -1, createdAt: -1 }).lean();
        if (docs && docs.length > 0) {
          items = docs.map((d) => ({
            ...d,
            id: d.id || d._id.toString(),
          }));
        }
      } catch (err) {
        logger.warn(`MongoDB getAllBanners error: ${err.message}. Using memory store.`);
      }
    }

    if (items.length === 0) {
      items = Array.from(this.memoryBanners.values());
      if (status) {
        items = items.filter((b) => b.status === status);
      }
      if (gender && gender !== 'all') {
        items = items.filter((b) => !b.genderTarget || b.genderTarget === 'all' || b.genderTarget === gender);
      }
      items.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }

    return items;
  }

  async createBanner(bannerData) {
    const id = bannerData.id || `camp_${Date.now().toString(36)}`;
    const newBanner = {
      ...bannerData,
      id,
      name: bannerData.name || 'Atelier Promotional Event',
      headline: bannerData.headline || 'LUXURY DISCOUNT EVENT — LIMITED TIME',
      description: bannerData.description || '',
      bannerImage: bannerData.bannerImage || '/images/products/women/women_1.svg',
      mobileBannerImage: bannerData.mobileBannerImage || '',
      type: bannerData.type || 'category',
      targetCategory: bannerData.targetCategory || 'all',
      genderTarget: bannerData.genderTarget || 'all',
      discountType: bannerData.discountType || 'percentage',
      discountValue: Number(bannerData.discountValue) || 15,
      maxDiscount: Number(bannerData.maxDiscount) || 3000,
      minOrderValue: Number(bannerData.minOrderValue) || 0,
      startDate: bannerData.startDate ? new Date(bannerData.startDate).toISOString() : new Date().toISOString(),
      endDate: bannerData.endDate ? new Date(bannerData.endDate).toISOString() : new Date(Date.now() + 14 * 86400000).toISOString(),
      status: bannerData.status || 'active',
      priority: Number(bannerData.priority) || 5,
      ctaText: bannerData.ctaText || 'Shop Collection',
      ctaUrl: bannerData.ctaUrl || '/catalog',
      marqueeEnabled: Boolean(bannerData.marqueeEnabled),
      marqueeText: bannerData.marqueeText || '',
      createdBy: bannerData.createdBy || 'Administrator',
      approvedBy: bannerData.approvedBy || 'System Administrator',
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };

    if (this.isDbConnected()) {
      try {
        const createdDoc = await Banner.create(newBanner);
        newBanner.id = createdDoc.id || createdDoc._id.toString();
      } catch (err) {
        logger.warn(`Could not save new banner to MongoDB: ${err.message}`);
      }
    }

    this.memoryBanners.set(newBanner.id, newBanner);
    return newBanner;
  }

  async deleteBanner(id) {
    let deleted = false;

    if (this.isDbConnected()) {
      try {
        const query = { $or: [{ id }] };
        if (mongoose.Types.ObjectId.isValid(id)) {
          query.$or.push({ _id: id });
        }
        const res = await Banner.deleteOne(query);
        deleted = res.deletedCount > 0;
      } catch (err) {
        logger.warn(`Could not delete banner from MongoDB: ${err.message}`);
      }
    }

    if (this.memoryBanners.has(id)) {
      this.memoryBanners.delete(id);
      deleted = true;
    }

    for (const [key, banner] of this.memoryBanners.entries()) {
      if (banner.id === id) {
        this.memoryBanners.delete(key);
        deleted = true;
      }
    }

    return deleted;
  }

  async updateBanner(id, updates) {
    if (this.isDbConnected()) {
      try {
        const query = { $or: [{ id }] };
        if (mongoose.Types.ObjectId.isValid(id)) {
          query.$or.push({ _id: id });
        }
        await Banner.updateOne(query, { $set: updates });
      } catch (err) {
        logger.warn(`Could not update banner in MongoDB: ${err.message}`);
      }
    }

    const current = this.memoryBanners.get(id);
    if (current) {
      const merged = { ...current, ...updates };
      this.memoryBanners.set(id, merged);
      return merged;
    }
    return null;
  }
}

export const bannerService = new BannerService();
