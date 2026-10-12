# SCAR Verification & Testing Strategy

## 1. Testing Philosophy
Zero features or architectural claims are declared complete without verifiable proof. Every domain boundary maintains dedicated unit, integration, and high-concurrency race condition tests.

---

## 2. Test Suites

### 2.1 Unit Tests
- **Pricing & Discounts**: Tax calculation, coupon discounts, currency formatting, subtotal assertions.
- **Zod Schemas**: Input validation tests for product creation, registration, and checkout schemas.
- **Recommendation Scorer**: Deterministic score distribution across varying preference profiles.

### 2.2 Integration Tests
- **Authentication Lifecycle**: Registration -> Login -> Refresh Token Rotation -> Access Denied -> Logout -> Token Revocation.
- **Role-Based Access Control**: Verifying customer cannot access `/api/v1/admin/*`, while admin receives HTTP 200.
- **Catalog Filtering**: Keyword search, multi-category filters, price range clipping.

### 2.3 High-Concurrency Anti-Overselling Tests (Critical)
- **The "Final Unit" Test**:
  - Setup: Product variant with exactly `stock = 1`.
  - Action: Spawn 10 simultaneous asynchronous HTTP checkout requests using `Promise.all()`.
  - Expected Empirical Result: Exactly **1** checkout returns HTTP 201 (`ORDER_CREATED`). Exactly **9** checkouts return HTTP 409 (`INSUFFICIENT_STOCK`). Final variant stock in database remains exactly `0`.
- **Idempotency Test**:
  - Two rapid identical requests with the same `Idempotency-Key` header return identical cached order responses and only charge / reserve once.

---

## 3. Running Test Suites

```bash
# Run backend test suite
cd backend
npm test

# Run concurrency tests specifically
npm run test:concurrency

# Run frontend test suite
cd frontend
npm test
```
