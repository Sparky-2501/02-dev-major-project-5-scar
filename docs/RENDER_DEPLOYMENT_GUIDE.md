# 🚀 Complete Deployment Guide: SCAR on Render + MongoDB Atlas

This guide walks you through deploying the **SCAR E-Commerce Platform** to production using **MongoDB Atlas** (database) and **Render** (cloud hosting for both backend API and frontend).

---

## 🏗️ Architecture Overview

```
   ┌──────────────────────────────────────────────────────────────┐
   │                   End User Browser                           │
   └───────────────┬───────────────────────────────┬──────────────┘
                   │                               │
        Static Assets (HTML/JS/CSS)         API Calls (/api/v1/...)
                   │                               │
                   ▼                               ▼
     ┌───────────────────────────┐   ┌───────────────────────────┐
     │   Render Static Site      │   │   Render Web Service      │
     │     (React / Vite)        │───▶   (Node.js / Express)     │
     │  https://scar.onrender.com│   │https://api.scar.onrender.com│
     └───────────────────────────┘   └─────────────┬─────────────┘
                                                   │
                              TLS / Mongoose       │ Cloudinary API
                                                   ▼
                         ┌───────────────────────────────────────┐
                         │   MongoDB Atlas Cloud Cluster (M0)    │
                         │   + Cloudinary Media Storage CDN      │
                         └───────────────────────────────────────┘
```

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
1. A **GitHub** account with this repository pushed.
2. A free account on **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**.
3. A free account on **[Render](https://render.com/)**.
4. *(Optional but recommended)* A free account on **[Cloudinary](https://cloudinary.com/)** for image uploads.

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

Render does not host a persistent free database container, so MongoDB Atlas provides a 100% free, production-ready M0 cluster.

### 1.1 Create Free M0 Cluster
1. Sign in to [MongoDB Atlas](https://account.mongodb.com/).
2. Click **Build a Database** &rarr; Select **M0 Free**.
3. Choose your nearest cloud region (e.g., AWS Mumbai `ap-south-1` or closest to you).
4. Name your cluster (e.g., `Cluster0` or `scar-cluster`) and click **Create Deployment**.

### 1.2 Create Database User Credentials
1. In the **Security & Quickstart** screen:
   - Username: `scar_admin`
   - Password: Click **Autogenerate Secure Password** or set a strong password (e.g., `ScarSuper2026!`).
   - ⚠️ **Save this password!** You will need it in your connection string.
2. Click **Create Database User**.

### 1.3 Allow Network Access (Render IP Whitelist)
Since Render uses dynamic IP addresses, you must allow universal access:
1. In the left sidebar, click **Network Access**.
2. Click **Add IP Address**.
3. Select **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Click **Confirm**.

### 1.4 Get the Connection String
1. In the left sidebar, go to **Clusters** / **Database**.
2. Click **Connect** on your cluster.
3. Choose **Drivers** &rarr; Select **Node.js** (version 5.5 or later).
4. Copy the connection string. It will look like:
   ```
   mongodb+srv://scar_admin:<db_password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Replace `<db_password>` with your actual database password and append the database name `scar_ecommerce`:
   ```
   mongodb+srv://scar_admin:ScarSuper2026!@cluster0.xxxx.mongodb.net/scar_ecommerce?retryWrites=true&w=majority
   ```

---

## 🖥️ Step 2: Deploy Backend Web Service on Render

The backend runs as a Render **Web Service** (Node.js runtime).

1. Log in to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** &rarr; Select **Web Service**.
3. Connect your GitHub repository (`mp-6`).
4. Configure the service settings:
   - **Name**: `scar-backend-api` (or your chosen name)
   - **Region**: Nearest to your MongoDB region (e.g., Singapore / Frankfurt / Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend` *(CRITICAL: Must be `backend`)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Expand **Advanced** / **Environment Variables** and add the following keys:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `PORT` | `10000` | Render default port |
| `MONGODB_URI` | `mongodb+srv://scar_admin:...` | Your Atlas connection string |
| `JWT_ACCESS_SECRET` | `generate-a-random-32-char-string` | Used to sign JWTs |
| `JWT_REFRESH_SECRET` | `generate-another-random-string` | Used to sign refresh tokens |
| `FRONTEND_URL` | `https://scar-frontend.onrender.com` | Will update once frontend is deployed |
| `CLOUDINARY_CLOUD_NAME` | *(your cloudinary name)* | Optional (in-memory mock works if omitted) |
| `CLOUDINARY_API_KEY` | *(your cloudinary key)* | Optional |
| `CLOUDINARY_API_SECRET` | *(your cloudinary secret)* | Optional |

6. Click **Create Web Service**.
7. Wait 2–3 minutes for the build to finish.
8. When ready, Render will provide your public URL (e.g., `https://scar-backend-api.onrender.com`).
9. **Test it immediately** in your browser by visiting:
   `https://scar-backend-api.onrender.com/api/v1/health`
   You should see:
   ```json
   {
     "status": "UP",
     "service": "SCAR Production API",
     "features": {
       "inventoryGuard": "atomic_concurrency_ready",
       "cloudinaryConfigured": true
     }
   }
   ```

---

## 🌐 Step 3: Deploy Frontend Static Site on Render

The frontend is a Vite + React Single Page Application (SPA).

1. In Render Dashboard, click **New +** &rarr; Select **Static Site**.
2. Connect the same GitHub repository (`mp-6`).
3. Configure the frontend settings:
   - **Name**: `scar-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend` *(CRITICAL: Must be `frontend`)*
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Configure **Redirects / Rewrites** *(CRITICAL FOR API COMMUNICATION)*:
   Render Static Sites have a built-in proxy router. This routes `/api/*` requests to your backend without any CORS hurdles!
   - Scroll down to the **Redirects/Rewrites** section.
   - Click **Add Rule**:
     - **Type**: `Rewrite`
     - **Source**: `/api/*`
     - **Destination**: `https://scar-backend-api.onrender.com/api/*` *(use your actual backend URL)*
   - Click **Add Rule** again for client-side routing:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
5. Click **Create Static Site**.
6. Render will run `npm install && npm run build` and publish your app.

---

## 🔄 Step 4: Final Handshake (Update CORS in Backend)

Now that your frontend has a live URL:
1. Go back to your backend service on Render (`scar-backend-api`).
2. Go to **Environment Variables**.
3. Update `FRONTEND_URL` to your actual frontend URL:
   `FRONTEND_URL = https://scar-frontend.onrender.com`
4. Click **Save Changes** (Render will automatically re-deploy backend with the updated CORS origin).

---

## 🧪 Step 5: Post-Deployment Verification Checklist

Verify all major features in the live production environment:

1. **Health Check**: Open `https://scar-backend-api.onrender.com/api/v1/health` &rarr; verify `HTTP 200 OK`.
2. **Frontend UI**: Open your frontend URL &rarr; verify products, banners, and layout load cleanly.
3. **Authentication**:
   - Log in using demo customer: `user@gmail.com` / `user`.
   - Log in using store manager: `manager@scar.local` / `ManagerSecurePassword123!`.
   - Log in using administrator: `admin@scar.local` / `AdminSecurePassword123!`.
   - Test Sign Up: Create a new user and confirm persistence.
4. **Checkout & Concurrency**:
   - Add items to cart.
   - Complete checkout & confirm stock decrements without over-selling.
5. **Image Upload (Cloudinary)**:
   - Log in as Manager &rarr; Add product with image upload &rarr; Verify image renders from Cloudinary CDN.

---

## 💡 Pro-Tips for Render Free Tier

- **Spin-down Behavior**: Free Web Services on Render sleep after 15 minutes of inactivity. When you visit the site, the first API request may take ~30-40 seconds to wake the backend container. Subsequent requests will be instant.
- **Uptime Monitoring**: You can use free services like [UptimeRobot](https://uptimerobot.com/) to ping `https://scar-backend-api.onrender.com/api/v1/health` every 10 minutes to keep the container warm and prevent sleep.
