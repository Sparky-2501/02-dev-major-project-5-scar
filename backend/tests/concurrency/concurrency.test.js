import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../../src/app.js';
import { inventoryService } from '../../src/services/inventoryService.js';

test('HIGH-CONCURRENCY RACE CONDITION: Exactly 1 Winner for Final Unit', async () => {
  // 1. Reset inventory to ensure SKU M1-BLK-XL has exactly 1 unit in stock
  inventoryService.reset();
  const testSku = 'M1-BLK-XL';
  const initialStock = inventoryService.getStock(testSku);
  assert.equal(initialStock, 1, 'Pre-condition: stock must be exactly 1');

  // 2. Launch 10 simultaneous concurrent checkout requests competing for the 1 unit
  const concurrentClients = 10;
  const requests = Array.from({ length: concurrentClients }, (_, i) =>
    request(app)
      .post('/api/v1/checkout/purchase')
      .send({ sku: testSku, quantity: 1 })
      .set('X-Correlation-ID', `race-test-${i}`)
  );

  const responses = await Promise.all(requests);

  // 3. Count outcomes
  const successes = responses.filter((res) => res.status === 201);
  const conflicts = responses.filter((res) => res.status === 409);

  // 4. Assert strict zero-overselling guarantees
  assert.equal(successes.length, 1, 'Exactly ONE request must succeed with HTTP 201');
  assert.equal(conflicts.length, 9, 'Exactly NINE competing requests must fail with HTTP 409 Conflict');

  // 5. Final stock must be exactly 0
  const finalStock = inventoryService.getStock(testSku);
  assert.equal(finalStock, 0, 'Final stock in inventory must be exactly 0 (no negative/phantom stock)');
});
