#!/bin/bash

# Deployment script for Lostal project
# Usage: ./deploy.sh [environment] [component]
# Example: ./deploy.sh dev infrastructure

set -e

ENVIRONMENT=${1:-dev}
COMPONENT=${2:-all}

echo "🚀 Deploying Lostal project..."
echo "Environment: $ENVIRONMENT"
echo "Component: $COMPONENT"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo "❌ Invalid environment. Use: dev, staging, or prod"
    exit 1
fi

# Validate component
if [[ ! "$COMPONENT" =~ ^(infrastructure|frontend|admin-frontend|lambda|all)$ ]]; then
    echo "❌ Invalid component. Use: infrastructure, frontend, admin-frontend, lambda, or all"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS credentials not configured"
    exit 1
fi

echo "✅ AWS credentials verified"

# Deploy infrastructure
if [[ "$COMPONENT" == "infrastructure" || "$COMPONENT" == "all" ]]; then
    echo "🏗️ Deploying infrastructure..."
    
    # Deploy Terraform state bucket first
    cd infrastructure/terraform-state
    terraform init
    terraform apply -auto-approve
    cd ../..
    
    # Deploy environment-specific infrastructure
    cd infrastructure/environments/$ENVIRONMENT
    terraform init
    terraform apply -auto-approve
    
    echo "✅ Infrastructure deployed"
    cd ../../..
fi

# Build and deploy Lambda
if [[ "$COMPONENT" == "lambda" || "$COMPONENT" == "all" ]]; then
    echo "⚡ Building and deploying Lambda..."
    
    cd admin-api
    ./build.sh
    cd ..
    
    echo "✅ Lambda package built"
fi

# Build and deploy frontend
if [[ "$COMPONENT" == "frontend" || "$COMPONENT" == "all" ]]; then
    echo "🎨 Building and deploying frontend..."
    
    cd front
    npm run build
    
    # Deploy to S3
    BUCKET_NAME="lostal-$ENVIRONMENT-site"
    aws s3 sync .output/public/ s3://$BUCKET_NAME/ --delete
    
    # Invalidate CloudFront
    DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$BUCKET_NAME')].Id" --output text)
    if [[ -n "$DISTRIBUTION_ID" ]]; then
        aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
        echo "✅ CloudFront cache invalidated"
    fi
    
    echo "✅ Frontend deployed"
    cd ..
fi

# Build and deploy admin frontend
if [[ "$COMPONENT" == "admin-frontend" || "$COMPONENT" == "all" ]]; then
    echo "🎨 Building and deploying admin frontend..."
    
    cd admin-front
    npm run build
    
    # Deploy to S3
    BUCKET_NAME="lostal-$ENVIRONMENT-admin"
    aws s3 sync dist/ s3://$BUCKET_NAME/ --delete
    
    # Invalidate CloudFront
    DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$BUCKET_NAME')].Id" --output text)
    if [[ -n "$DISTRIBUTION_ID" ]]; then
        aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
        echo "✅ CloudFront cache invalidated for admin portal"
    fi
    
    echo "✅ Admin frontend deployed"
    cd ..
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Environment URLs:"
echo "Environment: $ENVIRONMENT"

if [[ "$COMPONENT" == "infrastructure" || "$COMPONENT" == "all" ]]; then
    cd infrastructure/environments/$ENVIRONMENT
    echo "Main Site: $(terraform output -raw main_site_cloudfront_url 2>/dev/null || echo 'Not available')"
    echo "Admin Portal: $(terraform output -raw admin_portal_cloudfront_url 2>/dev/null || echo 'Not available')"
    echo "API Gateway: $(terraform output -raw api_gateway_url 2>/dev/null || echo 'Not available')"
    cd ../../..
fi
