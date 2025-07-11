FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

FROM node:20-alpine AS runner

RUN apk add --no-cache ttf-dejavu fontconfig

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

ENV NODE_ENV=production

RUN chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "shard.js"]
