# SCAR Security Architecture & Threat Mitigation Guide

## 1. Threat Modeling & Security Posture

SCAR adopts defense-in-depth security principles. No request input is trusted regardless of origin. All API boundaries enforce strict schema validation, cryptographic assertions, and rate-limiting safeguards.

---

## 2. Mitigation Strategies for OWASP Top 10

### 2.1 Broken Access Control & IDOR
- Every protected route enforces JWT-backed authorization combined with strict ownership validation:
  - Users can only read/mutate their own carts, orders, and profiles.
  - Administrative endpoints require verified `admin` or `superadmin` role claims stored in server-verified tokens.
- Object IDs are strictly validated to prevent enumeration and access outside authorized tenant bounds.

### 2.2 Injection (NoSQL, XSS, Command)
- **NoSQL Injection Defense**: Express middleware strips mongo operator keys (`$where`, `$gt`, `$ne`, etc.) from raw query parameters and request bodies.
- **Strict Zod Schema Enforcement**: All payloads are validated against compile-time Zod schemas before reaching business logic.
- **XSS Prevention**: React automatically escapes untrusted string interpolations. Content Security Policy (CSP) headers are configured via Helmet.

### 2.3 Cryptographic Failures & Password Security
- **Password Hashing**: Passwords are hashed using Argon2id (or high-iteration bcrypt with unique salt). Plaintext passwords or reversible ciphers are strictly prohibited.
- **Timing Attack Mitigation**: Login endpoint introduces bounded progressive delay and uniform constant-time error responses (`"Invalid email or password"`) to prevent email enumeration.
- **Secret Isolation**: All credentials are read from environment variables; zero hardcoded secrets exist in source files.

### 2.4 Brute Force & Rate Limiting
- Multi-tier rate limiting:
  - Global API: 100 requests per minute per IP.
  - Auth Endpoints (`/login`, `/register`, `/forgot-password`): 5 requests per 15 minutes per IP with exponential backoff on repeated failures.
  - Checkout & Payment Endpoints: 10 requests per minute with mandatory `Idempotency-Key` headers.

### 2.5 Insecure Session & Cookie Architecture
- Tokens are delivered via `httpOnly`, `SameSite=Strict`, `secure` (in production) cookies to neutralize token theft via XSS.
- Dual-token strategy: 15-minute access token + 7-day refresh token with automatic token rotation and revocation list upon logout.

### 2.6 Server-Side Request Forgery (SSRF) & File Uploads
- Cloudinary URLs and uploaded asset identifiers are strictly verified via regex and Cloudinary SDK signatures. Arbitrary external URL downloads are strictly disallowed.

### 2.7 Audit Logging & Security Event Monitoring
- Append-only `AuditLog` collection records all security-sensitive events:
  - Failed logins and lockouts.
  - Administrative role elevations or product deletions.
  - Payment refund attempts and status discrepancies.
  - Unhandled application exceptions and correlation IDs.
