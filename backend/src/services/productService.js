import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { SEED_CATALOG } from '../data/seedCatalog.js';
import { inventoryService } from './inventoryService.js';
import { logger } from '../utils/logger.js';

class ProductService {
  constructor() {
    this.memoryProducts = new Map();
    // Pre-populate memory store with seed catalog
    SEED_CATALOG.forEach((item) => {
      this.memoryProducts.set(item.id || item.slug, { ...item });
      // Register stock in inventoryService
      if (item.variants && item.variants.length > 0) {
        item.variants.forEach((v) => {
          if (v.sku && !inventoryService.stockMap.has(v.sku)) {
            inventoryService.stockMap.set(v.sku, v.stock ?? 10);
          }
        });
      } else if (item.sku) {
        if (!inventoryService.stockMap.has(item.sku)) {
          inventoryService.stockMap.set(item.sku, item.stock ?? 10);
        }
      }
    });
  }

  isDbConnected() {
    return mongoose.connection.readyState === 1;
  }

  async ensureSeeded() {
    if (!this.isDbConnected()) return;
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        logger.info('📦 MongoDB Product collection is empty. Seeding luxury atelier catalog...');
        for (const item of SEED_CATALOG) {
          const doc = {
            id: item.id || `prod_${Date.now().toString(36)}`,
            title: item.title,
            slug: item.slug,
            category: item.category,
            genderFocus: item.genderFocus || (item.category === 'women' ? 'female' : item.category === 'men' ? 'male' : 'unisex'),
            brand: item.brand || 'SCAR Atelier',
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            rating: item.rating || 4.8,
            reviewsCount: item.reviewsCount || 24,
            description: item.description,
            thumbnail: item.thumbnail,
            images: item.images || [item.thumbnail],
            tags: item.tags || [],
            variants: item.variants || [{ sku: item.sku || `SKU-${Date.now()}`, size: 'One Size', color: 'Default', stock: item.stock || 10, price: item.price }],
          };
          await Product.create(doc);
        }
        logger.info('✨ Seeded luxury atelier products successfully into MongoDB.');
      }
    } catch (err) {
      logger.warn(`Could not seed products into MongoDB: ${err.message}`);
    }
  }

  async getAll({ category, gender } = {}) {
    let items = [];

    if (this.isDbConnected()) {
      try {
        const query = { isArchived: { $ne: true } };
        if (category && category !== 'all') {
          query.category = category;
        }
        if (gender && gender !== 'all') {
          query.$or = [{ genderFocus: gender }, { genderFocus: 'unisex' }, { category: gender === 'female' ? 'women' : 'men' }];
        }
        const docs = await Product.find(query).sort({ createdAt: -1 }).lean();
        if (docs && docs.length > 0) {
          items = docs.map((d) => ({
            ...d,
            id: d.id || d._id.toString(),
          }));
        }
      } catch (err) {
        logger.warn(`MongoDB getAllProducts error: ${err.message}. Falling back to memory store.`);
      }
    }

    if (items.length === 0) {
      // Use in-memory store
      items = Array.from(this.memoryProducts.values()).filter((p) => !p.isArchived);
      if (category && category !== 'all') {
        items = items.filter((p) => p.category === category);
      }
      if (gender && gender !== 'all') {
        items = items.filter(
          (p) =>
            p.genderFocus === gender ||
            p.genderFocus === 'unisex' ||
            (gender === 'female' && (p.category === 'women' || p.category === 'accessories')) ||
            (gender === 'male' && p.category === 'men')
        );
      }
    }

    // Attach live stock from inventoryService
    return items.map((item) => {
      let liveStock = item.stock;
      if (item.variants && item.variants.length > 0) {
        const updatedVariants = item.variants.map((v) => ({
          ...v,
          stock: inventoryService.getStock(v.sku) !== undefined ? inventoryService.getStock(v.sku) : (v.stock ?? 10),
        }));
        liveStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        return { ...item, stock: liveStock, variants: updatedVariants };
      }
      if (item.sku) {
        liveStock = inventoryService.getStock(item.sku);
      }
      return { ...item, stock: liveStock ?? 10 };
    });
  }

  async getById(id) {
    if (this.isDbConnected()) {
      try {
        const doc = await Product.findOne({ $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { slug: id }] }).lean();
        if (doc) return { ...doc, id: doc.id || doc._id.toString() };
      } catch (err) {
        // Fallback
      }
    }
    return this.memoryProducts.get(id) || null;
  }

  async addProduct(productData) {
    const id = productData.id || `prod_${Date.now().toString(36)}`;
    const slug = productData.slug || (productData.title ? productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `item-${Date.now()}`);

    const baseVariants = productData.variants && productData.variants.length > 0
      ? productData.variants
      : [
          {
            sku: productData.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
            size: productData.size || 'One Size',
            color: productData.color || 'Standard',
            stock: Number(productData.stock) || 10,
            price: Number(productData.price) || 0,
          },
        ];

    // Register SKU stock into atomic inventoryService
    baseVariants.forEach((v) => {
      inventoryService.stockMap.set(v.sku, Number(v.stock) || 10);
    });

    const newProduct = {
      ...productData,
      id,
      slug,
      price: Number(productData.price) || 0,
      originalPrice: Number(productData.originalPrice) || Number(productData.price) || 0,
      rating: Number(productData.rating) || 5.0,
      reviewsCount: Number(productData.reviewsCount) || 1,
      category: productData.category || 'women',
      genderFocus: productData.genderFocus || (productData.category === 'women' ? 'female' : productData.category === 'men' ? 'male' : 'unisex'),
      brand: productData.brand || 'SCAR Atelier',
      thumbnail: productData.thumbnail || '/images/products/women/women_1.svg',
      images: productData.images || [productData.thumbnail || '/images/products/women/women_1.svg'],
      tags: Array.isArray(productData.tags) ? productData.tags : [productData.category],
      variants: baseVariants,
      stock: baseVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0),
      isArchived: false,
      createdAt: new Date().toISOString(),
    };

    if (this.isDbConnected()) {
      try {
        const createdDoc = await Product.create(newProduct);
        newProduct.id = createdDoc.id || createdDoc._id.toString();
      } catch (err) {
        logger.warn(`Could not save new product to MongoDB: ${err.message}. Kept in memory.`);
      }
    }

    this.memoryProducts.set(newProduct.id, newProduct);
    this.memoryProducts.set(newProduct.slug, newProduct);
    return newProduct;
  }

  async deleteProduct(id) {
    let deleted = false;

    if (this.isDbConnected()) {
      try {
        const query = { $or: [{ id }, { slug: id }] };
        if (mongoose.Types.ObjectId.isValid(id)) {
          query.$or.push({ _id: id });
        }
        const res = await Product.deleteOne(query);
        deleted = res.deletedCount > 0;
      } catch (err) {
        logger.warn(`Could not delete product from MongoDB: ${err.message}`);
      }
    }

    if (this.memoryProducts.has(id)) {
      this.memoryProducts.delete(id);
      deleted = true;
    }

    // Also look up by id in memory
    for (const [key, prod] of this.memoryProducts.entries()) {
      if (prod.id === id || prod.slug === id) {
        this.memoryProducts.delete(key);
        deleted = true;
      }
    }

    return deleted;
  }

  async updateProduct(id, updates) {
    if (this.isDbConnected()) {
      try {
        const query = { $or: [{ id }, { slug: id }] };
        if (mongoose.Types.ObjectId.isValid(id)) {
          query.$or.push({ _id: id });
        }
        await Product.updateOne(query, { $set: updates });
      } catch (err) {
        logger.warn(`Could not update product in MongoDB: ${err.message}`);
      }
    }

    const current = await this.getById(id);
    if (current) {
      const merged = { ...current, ...updates };
      this.memoryProducts.set(current.id, merged);
      return merged;
    }
    return null;
  }
}

export const productService = new ProductService();
