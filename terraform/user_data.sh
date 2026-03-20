#!/bin/bash
set -e

# Update and install dependencies
apt-get update -y
apt-get install -y ca-certificates curl gnupg git

# Install Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  \"$(. /etc/os-release && echo \"$VERSION_CODENAME\")\" stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable and start Docker
systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu

# Clone the repository (User needs to replace with actual secure git clone or pull via artifacts)
# Since the repo might be private, as an MVP we assume we are pulling the code securely or uploading via SCP
mkdir -p /app/dinevra
cd /app/dinevra

# Write the docker-compose.local.yml equivalent for MVP production
cat <<EOF > docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: dinevra_admin
      POSTGRES_PASSWORD: secure_mvp_password // CHANGE THIS
      POSTGRES_DB: dinevra_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: always

  api:
    image: user/dinevra-api:latest # Assume image is built and pushed to dockerhub, or built locally
    # To build locally on server, uncomment below:
    # build:
    #   context: ./dinevra-backend
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgres://dinevra_admin:secure_mvp_password@db:5432/dinevra_db?sslmode=disable
      REDIS_URL: redis:6379
      PORT: 8080
      STRIPE_SECRET_KEY: sk_test_something
    depends_on:
      - db
      - redis
    restart: always

volumes:
  postgres_data:
EOF

# Startup the orchestrated stack
# NOTE: User needs to build or pull the API image inside /app/dinevra
# docker compose up -d
