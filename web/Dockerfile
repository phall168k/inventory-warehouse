# ================================
# Step 1: Installing dependencies
# ================================
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm install

# ================================
# Step 2: Build Nuxt
# ================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY  . .

ENV NODE_ENV=production

RUN npm run build

# ================================
# Step 3: Production
# ================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]