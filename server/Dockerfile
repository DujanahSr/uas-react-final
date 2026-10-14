# ==========================================
# STAGE 1: Build Static Go Binary
# ==========================================
FROM golang:alpine AS builder

WORKDIR /app

ENV GOTOOLCHAIN=auto

# Cache Go module dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Compile static binary optimized for minimal size and high performance
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-w -s" \
    -o /app/flybook-server \
    ./cmd/api/main.go

# ==========================================
# STAGE 2: Minimal Security Hardened Runtime
# ==========================================
FROM alpine:3.20

WORKDIR /app

# Install root certs, timezone data, and curl for health check
RUN apk add --no-cache ca-certificates tzdata curl && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled binary from builder
COPY --from=builder /app/flybook-server /app/flybook-server

# Use unprivileged non-root user
USER appuser

# Expose API port
EXPOSE 8080

# Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/api/v1/health || exit 1

ENTRYPOINT ["/app/flybook-server"]
