# Build stage
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc --skipLibCheck --noEmitOnError false

# Production stage (distroless)
FROM gcr.io/distroless/nodejs:18

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["build/index.js"]
