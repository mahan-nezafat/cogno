# Build stage
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Production stage
FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD [ "npm", "start" ]
