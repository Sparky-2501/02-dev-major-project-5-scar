# SPEC: Project SCAR — Production E-Commerce Platform

**Status: FINALIZED**
**Version:** 1.0.0
**Architect:** Antigravity Senior Engineering Team

---

## 1. Executive Summary & Vision
**SCAR** is an enterprise-grade, high-concurrency, Amazon-inspired modern retail e-commerce platform built with an original brand identity, fluid design system, and production-ready micro-resilient architecture. 

It fulfills dual objectives:
1. **Commercial & Production Ready**: Realistic shopping workflows, variant-level stock management, deterministic + AI product recommendations, robust checkout with idempotency and atomic stock reservation, role-based admin operations with audit logs, and multi-instance containerized deployment.
2. **Zero-Friction Local Experience**: Fully functional out-of-the-box in zero-credential environments via deterministic local fallbacks (bundled demo catalogs, 50+ local high-resolution categorized assets, simulated payment modes, memory/local database fallbacks).

---

## 2. Core Functional Requirements

### 2.1 Catalog & Product Discovery
- Hierarchical taxonomy: Departments (Men, Women, Kids, Footwear, Electronics, Accessories, Home), Categories, and Subcategories.
- Variant-level attributes: Color, Size, SKU, barcode, price modifiers, and stock counters.
- Advanced faceted search, filtering (price range, brand, ratings, availability, tags), multi-field sorting, and cursor/page pagination.
- Rich product detail pages (PDP) with high-res multi-angle galleries, lightbox zoom, live inventory alerts, and cross-sell/up-sell recommendations.

### 2.2 Strict Concurrency & Inventory Reservation
- **Anti-Overselling Guarantee**: Variant-level atomic decrement via conditional MongoDB updates (`$inc: { stock: -qty }, { $gte: qty }`) preventing concurrent race hazards.
- **Reservation Lifecycle**: Time-to-live (TTL) stock holds during checkout (default: 10 minutes). Automatic rollback and release on expiry or order cancellation.
- **Idempotency**: Strict request deduplication on checkout (`Idempotency-Key` headers) to prevent double-charging or duplicate order creation.

### 2.3 Authentication, Authorization & Security
- Argon2id / bcrypt password hashing with salt and progressive delay protections against brute force.
- Dual-token HTTP-only cookie authentication (JWT access + refresh token rotation) with CSRF mitigation.
- Strict Role-Based Access Control (`customer`, `support`, `admin`, `superadmin`).
- Security hardening: Helmet, custom rate limiters, NoSQL injection sanitation, strict Zod schemas, CORS allowlists, and request correlation IDs (`X-Correlation-ID`).

### 2.4 Payment & Checkout Engine
- Payment Provider Abstraction Layer (`PaymentGatewayInterface`):
  - `SimulatedGateway`: Documented, cryptographically signed mock gateway for offline/test evaluation.
  - `RazorpayGateway` / `StripeGateway`: Production-ready test & live handlers with cryptographic webhook signature validation.
- Clear distinction between simulated demo purchases and actual financial transactions.

### 2.5 AI-Powered Recommendations
- Hybrid recommendation pipeline:
  - **Deterministic Engine**: Content-based filtering using category affinities, price bounds, product tags, recently viewed items, and explicit user preference quizzes.
  - **Pluggable AI Provider**: Configurable OpenAI/Gemini semantic search and personalized discovery layer with transparent fallback to deterministic ranking.

### 2.6 Administration Dashboard & Operational Observability
- Aggregated real-time metrics: Gross Merchandise Value (GMV), order volume, low-stock warnings, user churn, and conversion metrics.
- Comprehensive CRUD: Products, variants, inventory replenishment, category trees, and order fulfillment states.
- Append-only security & audit logging tracking administrative interventions, security anomalies, and authentication failures.
- Structured JSON logging (Pino/Winston) and readiness/liveness endpoints (`/health/live`, `/health/ready`).

---

## 3. Technology Stack Specification

- **Frontend**: React 18+ (Vite), JavaScript (ESM), React Router v6, Tailwind CSS, Framer Motion, TanStack Query v5, Lucide React, React Hook Form, Zod.
- **Backend**: Node.js v24+, Express 4/5, Mongoose / MongoDB Native, Zod, Argon2 / bcryptjs, JsonWebToken, Pino/Winston.
- **Data & Caching**: MongoDB 7.0+, Redis 7+ (gracefully degraded when offline).
- **Media**: Local asset manifest fallback (50+ high-res images) + Cloudinary storage pipeline.
- **DevOps**: Docker, Docker Compose (multi-instance app + NGINX load balancer + MongoDB + Redis), GitHub Actions CI.

---

## 4. Verification & Acceptance Criteria
- [x] Zero-credential startup works cleanly with local static assets and demo fixtures.
- [x] 100% concurrent checkout tests pass (2+ concurrent threads competing for 1 remaining stock item results in exactly 1 success and 1 clean 409 conflict).
- [x] Full test suites passing: Unit, Integration, Concurrency, and E2E smoke tests.
- [x] Complete production documentation generated.
