# SCAR Deployment & Infrastructure Guide

## 1. Overview
SCAR is containerized using Docker and Docker Compose. It features automated multi-instance backend worker scaling behind an NGINX reverse proxy with health checking and automatic load balancing.

---

## 2. Local Multi-Instance Docker Deployment

### Prerequisites
- Docker Engine 24.0+
- Docker Compose v2.20+

### One-Command Launch
```bash
docker compose up --build -d
```

### Topology & Ports
| Container Service | Role | Exposed Port | Description |
|---|---|---|---|
| `scar_lb` | NGINX Load Balancer | `80` (HTTP) | Upstream proxy, SSL termination, static caching |
| `scar_api_1` | Backend Worker Node 1 | Internal | Node.js Express API runtime instance 1 |
| `scar_api_2` | Backend Worker Node 2 | Internal | Node.js Express API runtime instance 2 |
| `scar_frontend`| Frontend Web Client | `5173` (Dev) / `80` | Production React static bundle served by NGINX |
| `scar_mongo` | Database | `27017` | MongoDB 7.0 database engine |
| `scar_redis` | Cache & Distributed Lock| `6379` | In-memory key-value cache and lock engine |

---

## 3. Production Readiness & Hardening

1. **Environment Variables**:
   - Ensure all keys in `.env` are injected securely via secret managers (AWS Secrets Manager, Doppler, or GitHub Actions Secrets).
   - Never commit production passwords or JWT keys.

2. **TLS / HTTPS Termination**:
   - Production NGINX configuration terminates HTTPS with Let's Encrypt or Cloudflare certificates.
   - Strict HTTP Strict Transport Security (HSTS) headers enabled (`max-age=31536000; includeSubDomains; preload`).

3. **Horizontal Scaling**:
   - Scale API workers dynamically:
     ```bash
     docker compose up --scale backend=4 -d
     ```
   - NGINX upstream handles round-robin distribution with zero session-affinity dependency because all session tokens are verified statelessly or via shared Redis.

4. **Graceful Shutdown**:
   - Express server listens for `SIGTERM` and `SIGINT`, rejects new traffic, drains active requests within 10 seconds, closes database connection pools cleanly, and exits code 0.
