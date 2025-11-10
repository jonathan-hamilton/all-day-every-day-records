# Use official PHP image with built-in server
FROM php:8.2-cli

# Install mysqli extension for database connectivity
RUN docker-php-ext-install mysqli

# Set working directory
WORKDIR /app

# Copy PHP files
COPY . /app

# Expose port
EXPOSE 8000

# Start PHP built-in server
CMD ["php", "-S", "0.0.0.0:8000", "-t", "/app"]