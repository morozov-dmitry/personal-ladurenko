#!/bin/bash

# Start DynamoDB Docker container for local development
echo "🐳 Starting DynamoDB Docker container..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start the DynamoDB container
docker-compose up -d dynamodb

# Wait for DynamoDB to be ready
echo "⏳ Waiting for DynamoDB to be ready..."
timeout=30
counter=0

while [ $counter -lt $timeout ]; do
    if curl -s http://localhost:8000 > /dev/null 2>&1; then
        echo "✅ DynamoDB is ready!"
        echo "📍 DynamoDB endpoint: http://localhost:8000"
        echo "🌍 Region: eu-central-1"
        echo "🔑 Access Key: dummy"
        echo "🔑 Secret Key: dummy"
        echo ""
        echo "You can now start the admin-api with: npm run start:dev"
        exit 0
    fi
    
    sleep 1
    counter=$((counter + 1))
    echo -n "."
done

echo ""
echo "❌ DynamoDB failed to start within $timeout seconds"
echo "Check the logs with: docker-compose logs dynamodb"
exit 1
