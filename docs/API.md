# SCAR REST API v1 Specification

All endpoints are versioned under `/api/v1`.  
Responses adhere to the JSend-compliant standard envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

Error envelopes:
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Requested variant is out of stock.",
    "details": []
  },
  "correlationId": "req-12345-abcde"
}
```

---

## 1. Authentication & Users (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new customer account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & issue httpOnly cookies |
| `POST` | `/api/v1/auth/logout` | Authenticated | Revoke session & clear cookies |
| `POST` | `/api/v1/auth/refresh` | Public (Cookie) | Rotate refresh token and issue new access token |
| `GET` | `/api/v1/auth/me` | Authenticated | Fetch current authenticated user profile |
| `PATCH` | `/api/v1/auth/profile` | Authenticated | Update user profile & addresses |

---

## 2. Catalog & Discovery (`/api/v1/products`, `/api/v1/categories`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/categories` | Public | Fetch category hierarchy and navigation tree |
| `GET` | `/api/v1/products` | Public | Search and filter catalog with pagination |
| `GET` | `/api/v1/products/:slugOrId` | Public | Fetch detailed product with variants & galleries |
| `GET` | `/api/v1/products/:id/recommendations` | Public | Fetch deterministic & AI-scored product recommendations |

Query Parameters for `GET /api/v1/products`:
- `q`: Search keyword (title, brand, tags)
- `category`: Category slug/ID
- `minPrice`, `maxPrice`: Price range filters
- `brand`: Comma-separated list of brands
- `inStock`: Boolean filter for available inventory
- `sort`: `price_asc`, `price_desc`, `newest`, `rating`, `popular`
- `page`, `limit`: Pagination parameters (default: page=1, limit=12)

---

## 3. Cart & Inventory Reservation (`/api/v1/cart`, `/api/v1/checkout`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/cart` | Public / Auth | Get current cart items and calculated totals |
| `POST` | `/api/v1/cart/items` | Public / Auth | Add item/variant to cart |
| `PATCH` | `/api/v1/cart/items/:itemId`| Public / Auth | Update item quantity |
| `DELETE`| `/api/v1/cart/items/:itemId`| Public / Auth | Remove item from cart |
| `POST` | `/api/v1/checkout/reserve` | Authenticated | Hold stock atomically for 10 minutes |
| `POST` | `/api/v1/checkout/create-order` | Authenticated | Finalize checkout (Requires `Idempotency-Key`) |

---

## 4. Orders & Payments (`/api/v1/orders`, `/api/v1/payments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/orders` | Authenticated | List user order history |
| `GET` | `/api/v1/orders/:id` | Authenticated | Fetch order details, tracking & invoice |
| `POST` | `/api/v1/payments/process` | Authenticated | Execute demo or live payment provider transaction |
| `POST` | `/api/v1/payments/webhook` | Public (Signed) | Provider webhook callback (cryptographic signature) |

---

## 5. Administration (`/api/v1/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/metrics` | Admin | Aggregated GMV, orders, inventory alerts & metrics |
| `GET` | `/api/v1/admin/products` | Admin | Full product list with inventory controls |
| `POST` | `/api/v1/admin/products` | Admin | Create new product and variant matrix |
| `PUT` | `/api/v1/admin/products/:id` | Admin | Update product details & inventory |
| `DELETE`| `/api/v1/admin/products/:id` | Admin | Soft delete or archive product |
| `GET` | `/api/v1/admin/orders` | Admin | Search and filter all orders |
| `PATCH` | `/api/v1/admin/orders/:id/status`| Admin | Update fulfillment state (Shipped, Delivered) |
| `GET` | `/api/v1/admin/audit-logs` | Superadmin | Inspect system security & admin action logs |
