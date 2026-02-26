# Use official Node.js LTS image based on Red Hat UBI (Universal Base Image)
FROM registry.access.redhat.com/ubi8/nodejs-18:latest

# Set working directory
WORKDIR /opt/app-root/src

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p database public

# Set environment variables
ENV NODE_ENV=production \
    PORT=8080

# Expose port (OpenShift uses 8080 by default)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/api/products', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the application
CMD ["node", "server.js"]