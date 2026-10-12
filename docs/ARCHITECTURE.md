# SCAR Architecture & System Design Document

## 1. System Overview

**SCAR** is an enterprise-grade, high-concurrency retail e-commerce platform designed with micro-resilience and modular domain boundaries. The system prioritizes transactional correctness, anti-overselling guarantees, sub-millisecond local responses, and graceful degradation when auxiliary cloud services are disconnected.

```
                      +-----------------------------+
                      |     NGINX Load Balancer     |
                      | (Port 80 / SSL Termination) |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                                           |
+--------------v---------------+             +--------------v---------------+
|    SCAR API Node (Inst 1)    |             |    SCAR API Node (Inst 2)    |
| Express / Zod / Service Repos|             | Express / Zod / Service Repos|
+--------------+---------------+             +--------------+---------------+
               |                                           |
               +---------------------+---------------------+
                                     |
                      +--------------v--------------+
                      |        Data & State         |
                      |  MongoDB 7.0 (Replica/Docs) |
                      |  Redis 7.0 (Cache/Locks)    |
                      +-----------------------------+
```

---

## 2. Core Architecture Principles

1. **Modular Monolith First, Horizontally Scalable**:
   - Clean architectural layers:
     - `Controllers`: HTTP transport, status codes, and response envelopes.
     - `Services`: Business logic, transaction orchestration, idempotency checks.
     - `Repositories / Models`: Data persistence, schema constraints, atomic queries.
     - `Middlewares`: Security headers, correlation IDs, rate limiting, authentication & RBAC.
   - Designed to run seamlessly as a single node in development and horizontally scale behind NGINX without state leakage.

2. **Graceful Degradation & Zero-Credential Bootstrapping**:
   - The application functions 100% out of the box with zero external API keys.
   - If MongoDB is disconnected, a deterministic in-memory demo provider serves catalog exploration.
   - If Cloudinary is omitted, a 50+ local high-resolution asset manifest serves product galleries.
   - If Redis is unavailable, an in-memory sliding window rate limiter and cache act as fallbacks.
   - If payment credentials are empty, a cryptographically simulated payment gateway processes realistic demo orders.

3. **Strict Concurrency & Anti-Overselling Design**:
   - Never rely on frontend stock quantities or naive read-then-write updates.
   - Variant-level stock decrement relies on MongoDB atomic conditional updates:
     ```javascript
     const result = await Product.updateOne(
       { _id: productId, "variants.sku": sku, "variants.stock": { $gte: quantity } },
       { $inc: { "variants.$.stock": -quantity } }
     );
     if (result.matchedCount === 0) {
       throw new InsufficientStockError("Item is sold out or unavailable.");
     }
     ```
   - Short-lived TTL inventory reservations (10-minute hold) lock stock during checkout. If checkout is abandoned or payment fails, background sweeper cron restores stock immediately.

4. **Recommendation Engine Architecture**:
   - A dual-layer recommendation pipeline:
     - **Deterministic Scorer**: Content-based filtering considering category weights, price range proximity, tag intersection, and user preference inputs.
     - **AI/LLM Provider Interface**: Standardized adapter for vector/semantic embeddings or OpenAI/Gemini providers when configured.

---

## 3. Directory Layout

```
mp-6/
├── .gsd/                      # GSD protocol tracking, roadmap, specifications
├── docs/                      # Architectural, API, security & testing documentation
├── frontend/                  # React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── public/                # Static assets & 50+ curated product images
│   ├── src/
│   │   ├── components/        # Design system UI primitives & widgets
│   │   ├── context/           # Auth, Cart, Theme, and Demo state providers
│   │   ├── hooks/             # Custom React hooks (useCart, useAuth, etc.)
│   │   ├── pages/             # Storefront, PDP, Cart, Checkout, Admin pages
│   │   ├── services/          # API client & local catalog fallbacks
│   │   └── utils/             # Formatting, validation, and analytics utilities
├── backend/                   # Node.js + Express + Mongoose
│   ├── src/
│   │   ├── config/            # Environment validation & constants
│   │   ├── controllers/       # Route handlers
│   │   ├── middlewares/       # Auth, RBAC, Rate-limit, Correlation, Error handling
│   │   ├── models/            # Mongoose schemas (User, Product, Order, etc.)
│   │   ├── repositories/      # Data access layer
│   │   ├── routes/            # Versioned API routes (/api/v1)
│   │   ├── services/          # Core business logic (Checkout, Inventory, AI)
│   │   └── utils/             # Logger, crypto, token helpers
├── docker-compose.yml         # Multi-instance orchestration & load balancing
├── Dockerfile.frontend        # Production NGINX/Vite multi-stage build
├── Dockerfile.backend         # Production Node.js multi-stage build
└── nginx.conf                 # Reverse proxy & load balancing rules
```
