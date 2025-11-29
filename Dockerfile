# Stage 1: Build the application
FROM oven/bun:1 AS build

WORKDIR /app

# Copy package.json and bun.lock (if available)
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Accept build arguments
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_API_KEY

# Set environment variables
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY

# Build the application
RUN bun run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
