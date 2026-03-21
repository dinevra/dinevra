#!/bin/bash
# Dinevra EC2 Deploy Script
# Usage: Run on the EC2 instance to clone/update the repo and restart services
set -e

REPO_URL="https://github.com/$(git -C /app/dinevra remote get-url origin 2>/dev/null | sed 's/.*github.com[:/]//' | sed 's/.git$//' || echo 'username/dinevra')"
APP_DIR="/app/dinevra"
ENV_FILE="$APP_DIR/.env.prod"

echo "=== Dinevra EC2 Deploy ==="

# Create app directory if needed
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Clone if not already cloned, otherwise pull
if [ ! -d ".git" ]; then
  echo "Cloning repository..."
  git clone "$REPO_URL" .
else
  echo "Pulling latest changes..."
  git pull origin main
fi

# Ensure .env.prod exists with the required values
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Create it with:"
  echo "  POSTGRES_PASSWORD=your_secure_password"
  echo "  JWT_SECRET=your_jwt_secret"
  echo "  STRIPE_SECRET_KEY=your_stripe_key"
  exit 1
fi

# Run database migrations
echo "Running migrations..."
export $(cat "$ENV_FILE" | xargs)
DB_URL="postgres://dinevra_admin:${POSTGRES_PASSWORD}@localhost:5432/dinevra?sslmode=disable"

# Start services (build API from source)
echo "Building and starting services..."
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --build

echo ""
echo "=== Deploy Complete ==="
echo "API running at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
