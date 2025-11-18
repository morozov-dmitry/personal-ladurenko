#!/bin/bash
# Script to import existing AWS resources into Terraform state for prod environment
# Run this from the infrastructure/environments/prod directory

set -e

ENVIRONMENT="prod"
PROJECT_NAME="ladurenko"
AWS_REGION="eu-central-1"

echo "This script will import existing AWS resources into Terraform state."
echo "Environment: $ENVIRONMENT"
echo "Project: $PROJECT_NAME"
echo "Region: $AWS_REGION"
echo ""
echo "Make sure you're in the infrastructure/environments/prod directory"
echo ""

# Check if we're in the right directory
if [ ! -f "main.tf" ] || [ ! -d "../../" ]; then
  echo "Error: Please run this script from infrastructure/environments/prod directory"
  exit 1
fi

# Initialize Terraform if not already done
echo "Initializing Terraform..."
terraform init -backend-config="bucket=ladurenko-terraform-state" -backend-config="key=prod/terraform.tfstate" -backend-config="region=eu-central-1"

echo ""
echo "Starting import process..."
echo ""

# Import S3 buckets
echo "1. Importing S3 buckets..."
terraform import module.infrastructure.aws_s3_bucket.main_site "${PROJECT_NAME}-${ENVIRONMENT}-site" || echo "  Main site bucket already imported or doesn't exist"
terraform import module.infrastructure.aws_s3_bucket.admin_portal "${PROJECT_NAME}-${ENVIRONMENT}-admin" || echo "  Admin portal bucket already imported or doesn't exist"

# Import S3 bucket configurations
echo "2. Importing S3 bucket configurations..."
terraform import module.infrastructure.aws_s3_bucket_public_access_block.main_site "${PROJECT_NAME}-${ENVIRONMENT}-site" || echo "  Main site public access block already imported"
terraform import module.infrastructure.aws_s3_bucket_public_access_block.admin_portal "${PROJECT_NAME}-${ENVIRONMENT}-admin" || echo "  Admin portal public access block already imported"
terraform import module.infrastructure.aws_s3_bucket_versioning.main_site "${PROJECT_NAME}-${ENVIRONMENT}-site" || echo "  Main site versioning already imported"
terraform import module.infrastructure.aws_s3_bucket_versioning.admin_portal "${PROJECT_NAME}-${ENVIRONMENT}-admin" || echo "  Admin portal versioning already imported"
terraform import module.infrastructure.aws_s3_bucket_server_side_encryption_configuration.main_site "${PROJECT_NAME}-${ENVIRONMENT}-site" || echo "  Main site encryption already imported"
terraform import module.infrastructure.aws_s3_bucket_server_side_encryption_configuration.admin_portal "${PROJECT_NAME}-${ENVIRONMENT}-admin" || echo "  Admin portal encryption already imported"

# Import S3 bucket policies (if they exist)
echo "3. Importing S3 bucket policies..."
terraform import module.infrastructure.aws_s3_bucket_policy.main_site "${PROJECT_NAME}-${ENVIRONMENT}-site" || echo "  Main site bucket policy not found or already imported"
terraform import module.infrastructure.aws_s3_bucket_policy.admin_portal "${PROJECT_NAME}-${ENVIRONMENT}-admin" || echo "  Admin portal bucket policy not found or already imported"

# Get and import CloudFront Origin Access Controls
echo "4. Importing CloudFront Origin Access Controls..."
MAIN_OAC_ID=$(aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='${PROJECT_NAME}-${ENVIRONMENT}-oac'].Id" --output text 2>/dev/null || echo "")
ADMIN_OAC_ID=$(aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='${PROJECT_NAME}-${ENVIRONMENT}-admin-oac'].Id" --output text 2>/dev/null || echo "")

if [ ! -z "$MAIN_OAC_ID" ] && [ "$MAIN_OAC_ID" != "None" ]; then
  terraform import module.infrastructure.aws_cloudfront_origin_access_control.main_site "$MAIN_OAC_ID" || echo "  Main site OAC already imported"
else
  echo "  Main site OAC not found - will be created"
fi

if [ ! -z "$ADMIN_OAC_ID" ] && [ "$ADMIN_OAC_ID" != "None" ]; then
  terraform import module.infrastructure.aws_cloudfront_origin_access_control.admin_portal "$ADMIN_OAC_ID" || echo "  Admin portal OAC already imported"
else
  echo "  Admin portal OAC not found - will be created"
fi

# Import CloudFront Function
echo "5. Importing CloudFront Function..."
terraform import module.infrastructure.aws_cloudfront_function.directory_handler "${PROJECT_NAME}-${ENVIRONMENT}-directory-handler" || echo "  CloudFront function not found or already imported"

# Import IAM Role
echo "6. Importing IAM Role..."
terraform import module.infrastructure.aws_iam_role.lambda_role "${PROJECT_NAME}-${ENVIRONMENT}-lambda-role" || echo "  IAM role not found or already imported"

# Import IAM Role Policy Attachments
echo "7. Importing IAM Role Policy Attachments..."
terraform import module.infrastructure.aws_iam_role_policy_attachment.lambda_basic_execution "${PROJECT_NAME}-${ENVIRONMENT}-lambda-role/arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" || echo "  IAM role policy attachment already imported"

# Import IAM Role Policies (inline policies)
echo "8. Importing IAM Role Policies..."
# Import S3 access policy
terraform import module.infrastructure.aws_iam_role_policy.lambda_s3_access "${PROJECT_NAME}-${ENVIRONMENT}-lambda-role/${PROJECT_NAME}-${ENVIRONMENT}-lambda-s3-access" || echo "  S3 access policy not found or already imported"
# Import DynamoDB access policy
terraform import module.infrastructure.aws_iam_role_policy.lambda_dynamodb_access "${PROJECT_NAME}-${ENVIRONMENT}-lambda-role/${PROJECT_NAME}-${ENVIRONMENT}-lambda-dynamodb-access" || echo "  DynamoDB access policy not found or already imported"

# Import DynamoDB tables
echo "9. Importing DynamoDB tables..."
terraform import module.infrastructure.aws_dynamodb_table.users "${PROJECT_NAME}-${ENVIRONMENT}-users" || echo "  Users table not found or already imported"
terraform import module.infrastructure.aws_dynamodb_table.orders "${PROJECT_NAME}-${ENVIRONMENT}-orders" || echo "  Orders table not found or already imported"
terraform import module.infrastructure.aws_dynamodb_table.comments "${PROJECT_NAME}-${ENVIRONMENT}-comments" || echo "  Comments table not found or already imported"

# Import Lambda function
echo "10. Importing Lambda function..."
terraform import module.infrastructure.aws_lambda_function.admin_api "${PROJECT_NAME}-${ENVIRONMENT}-admin-api" || echo "  Lambda function not found or already imported"

# Import Lambda permission
echo "11. Importing Lambda permission..."
# Get API Gateway ID first
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='${PROJECT_NAME}-${ENVIRONMENT}-admin-api'].id" --output text 2>/dev/null || echo "")
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
if [ ! -z "$API_ID" ] && [ "$API_ID" != "None" ]; then
  SOURCE_ARN="arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${API_ID}/*/*"
  terraform import module.infrastructure.aws_lambda_permission.api_gateway "${PROJECT_NAME}-${ENVIRONMENT}-admin-api/AllowExecutionFromAPIGateway" || echo "  Lambda permission already imported"
else
  echo "  API Gateway not found - Lambda permission will be created when API Gateway is created"
fi

# Import API Gateway resources (if they exist)
echo "12. Importing API Gateway resources..."
if [ ! -z "$API_ID" ] && [ "$API_ID" != "None" ]; then
  terraform import module.infrastructure.aws_api_gateway_rest_api.admin_api "$API_ID" || echo "  API Gateway already imported"
  
  # Import API Gateway resources and methods
  # Get the root resource ID
  ROOT_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id "$API_ID" --query "items[?path=='/'].id" --output text 2>/dev/null || echo "")
  if [ ! -z "$ROOT_RESOURCE_ID" ] && [ "$ROOT_RESOURCE_ID" != "None" ]; then
    terraform import module.infrastructure.aws_api_gateway_method.proxy_root "$API_ID/$ROOT_RESOURCE_ID/ANY" || echo "  Root method already imported"
    terraform import module.infrastructure.aws_api_gateway_integration.lambda_root "$API_ID/$ROOT_RESOURCE_ID/ANY" || echo "  Root integration already imported"
  fi
  
  # Get the proxy resource ID
  PROXY_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id "$API_ID" --query "items[?path=='/{proxy+}'].id" --output text 2>/dev/null || echo "")
  if [ ! -z "$PROXY_RESOURCE_ID" ] && [ "$PROXY_RESOURCE_ID" != "None" ]; then
    terraform import module.infrastructure.aws_api_gateway_resource.proxy "$API_ID/$PROXY_RESOURCE_ID" || echo "  Proxy resource already imported"
    terraform import module.infrastructure.aws_api_gateway_method.proxy "$API_ID/$PROXY_RESOURCE_ID/ANY" || echo "  Proxy method already imported"
    terraform import module.infrastructure.aws_api_gateway_integration.lambda "$API_ID/$PROXY_RESOURCE_ID/ANY" || echo "  Proxy integration already imported"
  fi
  
  # Import API Gateway deployment and stage
  DEPLOYMENT_ID=$(aws apigateway get-stages --rest-api-id "$API_ID" --query "item[0].deploymentId" --output text 2>/dev/null || echo "")
  if [ ! -z "$DEPLOYMENT_ID" ] && [ "$DEPLOYMENT_ID" != "None" ]; then
    terraform import module.infrastructure.aws_api_gateway_deployment.admin_api "$API_ID/$DEPLOYMENT_ID" || echo "  API Gateway deployment already imported"
    terraform import module.infrastructure.aws_api_gateway_stage.admin_api "$API_ID/$ENVIRONMENT" || echo "  API Gateway stage already imported"
  fi
else
  echo "  API Gateway not found - will be created"
fi

# Import CloudFront distributions (if they exist)
echo "13. Importing CloudFront distributions..."
MAIN_DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment==\`${PROJECT_NAME}-${ENVIRONMENT}-main-site\`].Id" --output text 2>/dev/null || echo "")
ADMIN_DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment==\`${PROJECT_NAME}-${ENVIRONMENT}-admin-portal\`].Id" --output text 2>/dev/null || echo "")

if [ ! -z "$MAIN_DIST_ID" ] && [ "$MAIN_DIST_ID" != "None" ]; then
  terraform import module.infrastructure.aws_cloudfront_distribution.main_site "$MAIN_DIST_ID" || echo "  Main site CloudFront distribution already imported"
else
  echo "  Main site CloudFront distribution not found - will be created"
fi

if [ ! -z "$ADMIN_DIST_ID" ] && [ "$ADMIN_DIST_ID" != "None" ]; then
  terraform import module.infrastructure.aws_cloudfront_distribution.admin_portal "$ADMIN_DIST_ID" || echo "  Admin portal CloudFront distribution already imported"
else
  echo "  Admin portal CloudFront distribution not found - will be created"
fi

echo ""
echo "Import process complete!"
echo ""
echo "Next steps:"
echo "1. Run 'terraform plan' to see what changes Terraform wants to make"
echo "2. Review the plan carefully"
echo "3. Run 'terraform apply' to sync the state with your configuration"
echo ""
echo "Note: Some resources may show as needing updates. This is normal if the"
echo "      Terraform configuration differs slightly from the existing resources."

