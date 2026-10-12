import { SEED_CATALOG } from '../data/seedCatalog.js';

// In-Memory Mutex Lock & Inventory Store for Concurrency Demonstrations
class InventoryService {
  constructor() {
    this.stockMap = new Map();
    // Load default seed catalog into memory
    SEED_CATALOG.forEach((item) => {
      this.stockMap.set(item.sku, item.stock);
    });
    this.reservations = new Map();
  }

  reset() {
    this.stockMap.clear();
    SEED_CATALOG.forEach((item) => {
      this.stockMap.set(item.sku, item.stock);
    });
    this.reservations.clear();
  }

  getStock(sku) {
    return this.stockMap.get(sku) ?? 0;
  }

  // ATOMIC CONDITIONAL STOCK DECREMENT (Zero-Overselling Guard)
  atomicPurchase(sku, quantity = 1) {
    const currentStock = this.stockMap.get(sku) ?? 0;
    
    // Strict atomic barrier: stock MUST be >= quantity
    if (currentStock < quantity) {
      const error = new Error(`Insufficient stock for SKU ${sku}. Available: ${currentStock}, Requested: ${quantity}`);
      error.statusCode = 409;
      error.code = 'INSUFFICIENT_STOCK';
      throw error;
    }

    // Decrement atomically
    this.stockMap.set(sku, currentStock - quantity);
    return {
      success: true,
      sku,
      purchasedQty: quantity,
      remainingStock: currentStock - quantity
    };
  }
}

export const inventoryService = new InventoryService();
