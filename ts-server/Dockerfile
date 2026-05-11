# ---------- Build Stage ----------
  FROM node:20-alpine AS builder

  WORKDIR /app
  
  # Copy dependency files
  COPY package.json yarn.lock ./
  
  # Install dependencies
  RUN yarn install --frozen-lockfile
  
  # Copy app source
  COPY . .
  
  # Build NestJS app
  RUN yarn build
  
  
  # ---------- Production Stage ----------
  FROM node:20-alpine
  
  WORKDIR /app
  
  # Copy dependency files
  COPY package.json yarn.lock ./
  
  # Install ONLY production deps
  RUN yarn install --frozen-lockfile --production
  
  # Copy built app from builder
  COPY --from=builder /app/dist ./dist
  
  # Cloud Run uses PORT env var
  ENV PORT=8080
  ENV NODE_ENV=production
  
  EXPOSE 8080
  
  CMD ["node", "dist/main"]