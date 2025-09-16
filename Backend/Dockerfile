# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Copy Google Cloud credentials
COPY gentle-scene-466610-a2-1436aaba1c89.json ./

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]