# Stage 1: Build the Vite application
FROM node:20-alpine as builder

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# --- ADD THIS LINE ---
# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# --- ADD THIS LINE ---
# Copy your custom configuration to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]