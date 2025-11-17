#!/bin/bash

# Stop DynamoDB Docker container
echo "🛑 Stopping DynamoDB Docker container..."

docker-compose down

echo "✅ DynamoDB container stopped"
