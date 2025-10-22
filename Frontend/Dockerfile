# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Declare build arg and set as env var for Vite build
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Build the application
RUN npm run build

# Expose port 80
# EXPOSE 80

# Install serve to serve the built app
RUN npm install -g serve

# Start the application
CMD ["serve", "-s", "dist", "-l", "80"]
