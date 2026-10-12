# Project SCAR — Production-Grade AI-Powered E-Commerce Platform

SCAR is a high-performance, high-concurrency, Amazon-inspired retail e-commerce platform built with an original brand identity, fluid design system, variant-level stock management, and containerized architecture.

---

## Key Features

- **Storefront & Catalog**: Fast faceted filtering, multi-field search, rich PDP galleries, variant matrix (size/color), and inventory counters.
- **Strict Concurrency & Anti-Overselling**: Variant-level atomic stock reservation in MongoDB preventing concurrent race hazards, backed by automated concurrency verification tests.
- **Zero-Credential Out-of-the-Box Mode**: Instant local execution with 50+ curated product images, bundled demo catalog fixtures, deterministic recommendation fallback, and simulated payment gateway.
- **AI-Powered & Deterministic Recommendations**: Multi-signal recommendation engine considering user affinities, price boundaries, category intersections, and preference quizzes.
- **Enterprise Security**: Argon2id password hashing, progressive delay brute-force protection, dual JWT tokens in httpOnly cookies, CSRF defense, NoSQL injection sanitation, and strict Zod schemas.
- **Admin Dashboard**: Real-time aggregated operational metrics, inventory controls, order fulfillment workflow, and append-only audit logging.
- **Production DevOps**: Multi-instance Docker Compose setup with NGINX reverse-proxy load balancing and GitHub Actions CI.

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js v20+ (Tested on Node v24)
- npm 10+
- Docker & Docker Compose (optional for containerized deployment)

### 2. Environment Configuration
Copy the environment template:
```bash
cp .env.example .env
```
*(No external API keys are required for full local functionality!)*

### 3. Running with Docker Compose (Recommended)
```bash
docker compose up --build
```
Access the application:
- **Storefront & App**: [http://localhost](http://localhost) (via NGINX Load Balancer) or [http://localhost:5173](http://localhost:5173) (Vite Dev Server)
- **API Health**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

### 4. Running Without Docker (Bare Metal)

#### Backend:
```bash
cd backend
npm install
npm run dev
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## Running Automated Tests

```bash
# Run unit & integration tests
cd backend
npm test

# Run high-concurrency race condition tests
npm run test:concurrency
```

---

## Documentation Index

- [System Architecture](file:///c:/Users/admin/OneDrive/coding/03-DEVLOPEMENT/personal/mp-6/docs/ARCHITECTURE.md)
- [Security Architecture](file:///c:/Users/admin/OneDrive/coding/03-DEVLOPEMENT/personal/mp-6/docs/SECURITY.md)
- [REST API Specification](file:///c:/Users/admin/OneDrive/coding/03-DEVLOPEMENT/personal/mp-6/docs/API.md)
- [Deployment & Load Balancing](file:///c:/Users/admin/OneDrive/coding/03-DEVLOPEMENT/personal/mp-6/docs/DEPLOYMENT.md)
- [Testing & Concurrency Verification](file:///c:/Users/admin/OneDrive/coding/03-DEVLOPEMENT/personal/mp-6/docs/TESTING.md)
- [Implementation Backlog](file:///c:/Users/admin/OneDrive/coding/03-DEVLOPEMENT/personal/mp-6/docs/IMPLEMENTATION_PLAN.md)
