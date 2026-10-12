# Production Multi-Stage Dockerfile for SCAR Backend
FROM node:24-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "src/server.js"]
