#!/bin/bash

# Build script for NestJS Lambda function - Simplified and reliable
set -e

echo "Building NestJS Lambda function..."

# Clean previous builds
rm -rf build
rm -f lambda-package.zip

# Create build directory
mkdir -p build

# Build the NestJS application
echo "Compiling TypeScript..."
npx tsc

# Copy compiled files to build directory
echo "Copying compiled files..."
cp -r dist/* build/

# Copy package.json and lambda.js
cp package.json build/
cp lambda.js build/ 2>/dev/null || cp dist/lambda.js build/lambda.js

# Install production dependencies
echo "Installing production dependencies..."
cd build

# Install only production dependencies
npm install --production --no-optional --no-audit --no-fund

# Remove some unnecessary files but keep essential ones
echo "Cleaning up unnecessary files..."
rm -rf node_modules/.cache
rm -rf node_modules/@types
rm -rf node_modules/typescript
rm -rf node_modules/@nestjs/cli
rm -rf node_modules/@nestjs/schematics
rm -rf node_modules/@nestjs/testing
rm -rf node_modules/jest
rm -rf node_modules/supertest
rm -rf node_modules/eslint*
rm -rf node_modules/prettier
rm -rf node_modules/ts-jest
rm -rf node_modules/ts-loader
rm -rf node_modules/ts-node
rm -rf node_modules/tsconfig-paths
rm -rf node_modules/typescript-eslint

# Remove test files
find . -name "*.spec.js" -delete
find . -name "*.test.js" -delete
find . -name "test" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove source maps (optional - can help with debugging)
# find . -name "*.map" -delete

# Create Lambda package
echo "Creating Lambda package..."
zip -r ../lambda-package.zip . -x "*.DS_Store" "*.git*"

# Clean up
cd ..
rm -rf build

# Show package size
PACKAGE_SIZE=$(du -h lambda-package.zip | cut -f1)
echo "✅ API Lambda package created: lambda-package.zip (${PACKAGE_SIZE})"