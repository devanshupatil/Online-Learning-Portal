# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# System dependencies for PDF rendering (pdftoppm)
RUN apk add --no-cache poppler-utils

# Install bun (used for dependency installation; the app itself still runs on Node)
RUN npm install -g bun

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --production --frozen-lockfile

# Copy source code
COPY . .

# Copy Google Cloud credentials
COPY gentle-scene-466610-a2-1436aaba1c89.json ./

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
