# SCAR Implementation Plan & Prioritized Backlog

This document outlines the detailed execution plan decomposed into modular phases and acceptance gates.

---

## Prioritized Implementation Backlog

### Phase 1: Foundation, Architecture & Documentation (Current)
- [x] Initialized Git repository & branches.
- [x] Master specification (`.gsd/SPEC.md`), roadmap (`.gsd/ROADMAP.md`), and state (`.gsd/STATE.md`).
- [x] System architecture, security, API, deployment, testing docs, and `.env.example`.
- [x] Acceptance Criteria: Complete specification lock and repo readiness.

### Phase 2: Frontend Foundation, Design System & Layout
- [ ] Initialize React + Vite application with Tailwind CSS, Lucide React, and Framer Motion.
- [ ] Implement design tokens (palette, typography, glassmorphism, responsive navigation).
- [ ] Implement shared UI primitives: Modal, Drawer, Toast, Breadcrumbs, Skeleton, Button, Badge.
- [ ] Establish React Router v6 tree (Home, Catalog, PDP, Cart, Checkout, Profile, Admin).
- [ ] Acceptance Criteria: Responsive interactive shell, accessible navigation, zero console errors.

### Phase 3: Catalog Assets, Manifest & Local Demo Storefront
- [ ] Generate/curate 50+ categorized high-res local product images across 7 departments.
- [ ] Build deterministic catalog manifest with rich variants, pricing, and specs.
- [ ] Build Storefront Home, Catalog faceted filters, and rich Product Detail Page with image lightbox zoom.
- [ ] Acceptance Criteria: Seamless browsing, zero broken images, instant search and filtering.

### Phase 4: Express API Core, Persistence & Catalog Endpoints
- [ ] Build Express ES module server, structured logging, correlation IDs, and centralized error handler.
- [ ] Mongoose schemas for User, Product, Category, Order, InventoryReservation, AuditLog.
- [ ] Zero-credential demo catalog fallback if MongoDB is not present.
- [ ] REST API v1 for catalog browsing, searching, and faceted queries.
- [ ] Acceptance Criteria: Clean JSend responses, resilient offline fallback, fast query execution.

### Phase 5: Authentication, RBAC & Security Hardening
- [ ] Implement Argon2/bcrypt password hashing, progressive rate limiting, and brute-force defenses.
- [ ] Dual-token auth via httpOnly cookies with rotation and revocation.
- [ ] Frontend AuthContext, Login/Register modals, and ProtectedRoute guards for Admin.
- [ ] Acceptance Criteria: Secure login/logout lifecycle, no token leaks in client storage, role gating verified.

### Phase 6: Cart, Atomic Inventory Reservations & Order Engine
- [ ] LocalStorage + server-synchronized cart engine.
- [ ] Atomic conditional stock decrement and 10-minute hold reservation algorithm.
- [ ] Idempotency key handling on checkout.
- [ ] Concurrency test suite proving zero overselling under race conditions.
- [ ] Acceptance Criteria: Concurrent checkout tests pass with 100% precision.

### Phase 7: Payment Engine & Realistic Checkout
- [ ] Extensible Payment Gateway Abstraction (`SimulatedGateway`, Razorpay, Stripe).
- [ ] Safe simulated ₹1 / demo payment flow with cryptographic confirmation.
- [ ] Order confirmation, receipt generation, and customer order history.
- [ ] Acceptance Criteria: Complete purchasing flow from PDP to confirmed order.

### Phase 8: AI & Deterministic Recommendation Engine
- [ ] Content-based deterministic recommendation scorer (categories, price, tags, preferences).
- [ ] Optional LLM provider adapter with seamless fallback.
- [ ] Recommendations integrated across Home, PDP, and Cart.
- [ ] Acceptance Criteria: Context-aware recommendations rendered with explainable match reasons.

### Phase 9: Administration Dashboard & Security Auditing
- [ ] Aggregated metrics dashboard (GMV, orders, inventory alerts).
- [ ] Product & inventory CRUD with variant management.
- [ ] Order fulfillment workflow (Processing, Shipped, Delivered).
- [ ] Append-only audit log viewer.
- [ ] Acceptance Criteria: Fully functional admin portal with strict role enforcement.

### Phase 10: Dockerization, Load Balancing & Production Readiness
- [ ] Multi-stage Dockerfiles for frontend and backend.
- [ ] Docker Compose orchestration with NGINX reverse proxy & load balancer.
- [ ] CI pipeline configuration (.github/workflows/ci.yml).
- [ ] Acceptance Criteria: `docker compose up` starts full working multi-node cluster.

### Phase 11: Verification, Automated Testing & Final Audit
- [ ] Execute full unit, integration, and concurrency test suites.
- [ ] SEO structured data & performance audit.
- [ ] Final handoff summary with operational commands.
- [ ] Acceptance Criteria: All tests pass, zero regressions, production ready.
