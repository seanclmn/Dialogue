# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


# ---------- Production Stage ----------
FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

# Cloud Run injects PORT automatically; defaults here match main.ts fallback.
ENV PORT=8080
ENV NODE_ENV=production

# Runtime env vars required (inject via Cloud Run --set-env-vars or Secret Manager):
#   REDIS_HOST        Memorystore instance IP (VPC connector required on Cloud Run)
#   REDIS_PORT        default 6379
#   REDIS_PASSWORD    if AUTH is enabled on the Memorystore instance
#   REDIS_TLS         set to "true" if in-transit encryption is enabled
#   DB_HOST / DB_PORT / DB_USERNAME / DB_PASSWORD / DB_DATABASE / DB_SOCKET_PATH
#   JWT_SECRET
#   GCS_BUCKET_NAME / GCS_PROJECT_ID

EXPOSE 8080

CMD ["node", "dist/main"]
