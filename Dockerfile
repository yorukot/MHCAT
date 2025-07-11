FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

FROM node:18-alpine

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
