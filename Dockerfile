FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# 先更新 npm 到最新版本，然後再執行安裝
RUN npm install -g npm@latest && \
    npm ci

COPY . .

FROM node:18-alpine AS runner

RUN apk add --no-cache ttf-dejavu fontconfig

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

ENV NODE_ENV=production

RUN chown -R nodejs:nodejs /app

USER nodejs

# 啟動機器人
CMD ["node", "shard.js"]
