    FROM node:18-alpine AS deps

    WORKDIR /app
    
    # Install dependencies first (better caching)
    COPY package.json package-lock.json* ./
    
    RUN npm ci --force
    
    FROM node:18-alpine AS builder
    
    WORKDIR /app
    
    # Copy node_modules from deps stage
    COPY --from=deps /app/node_modules ./node_modules
    
    # Copy source code
    COPY . .
    
    # Build the app
    RUN npm run build
    
    FROM node:18-alpine AS runner
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # Copy only required files
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/build ./build
    
    EXPOSE 3000
    
    CMD ["npm", "run", "start"]
    