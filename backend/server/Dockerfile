# Use Node.js 20 Alpine (lightweight Linux distribution)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy Prisma schema files
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the NestJS application (compiles TypeScript to JavaScript)
RUN npm run build

# Expose port 3000 (Railway will map this automatically)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
