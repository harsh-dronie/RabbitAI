# Stage 1: builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .

# Stage 2: production
FROM node:20-alpine AS runner
ENV NODE_ENV=production

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

# copy only needed artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services ./services
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/config ./config
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/swagger.js ./swagger.js

# expose and run
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --spider --quiet http://localhost:8000/api/health || exit 1
USER appuser
CMD ["node", "server.js"]
