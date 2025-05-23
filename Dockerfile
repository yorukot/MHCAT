# Build stage
FROM golang:1.21-alpine AS builder

# Install git for go modules
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Download dependencies (this layer will be cached unless go.mod/go.sum changes)
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o mhcat .

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates tzdata

# Create non-root user
RUN addgroup -g 1001 -S mhcat && \
    adduser -u 1001 -S mhcat -G mhcat

# Set working directory
WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /app/mhcat .

# Copy locales directory
COPY --from=builder /app/locales ./locales

# Change ownership to non-root user
RUN chown -R mhcat:mhcat /app

# Switch to non-root user
USER mhcat

# Expose port (if your bot has a web interface, adjust as needed)
# EXPOSE 8080

# Command to run the application
CMD ["./mhcat"] 