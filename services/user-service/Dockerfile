# -------------------------------
# 1️⃣ Build stage
# -------------------------------
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the service files
COPY . .

# -------------------------------
# 2️⃣ Runtime stage
# -------------------------------
FROM node:20-alpine

WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules
# Copy all project files
COPY --from=builder /app ./

# Expose the service port
EXPOSE 4000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the service
CMD ["npm", "start"]
