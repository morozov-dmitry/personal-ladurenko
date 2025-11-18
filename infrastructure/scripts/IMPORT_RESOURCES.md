# Importing Existing AWS Resources into Terraform

If you have existing AWS resources that were created outside of Terraform (or with a different state), you can import them into Terraform state.

## Quick Start

Run the automated import script:

```bash
cd infrastructure/environments/prod
../../scripts/import-prod-resources.sh
```

## Manual Import (if needed)

If you prefer to import resources manually, here are the commands:

### Prerequisites

1. Make sure you're in the correct directory:
   ```bash
   cd infrastructure/environments/prod
   ```

2. Initialize Terraform:
   ```bash
   terraform init -backend-config="bucket=ladurenko-terraform-state" \
                  -backend-config="key=prod/terraform.tfstate" \
                  -backend-config="region=eu-central-1"
   ```

### Import Commands

#### 1. S3 Buckets

```bash
terraform import module.infrastructure.aws_s3_bucket.main_site ladurenko-prod-site
terraform import module.infrastructure.aws_s3_bucket.admin_portal ladurenko-prod-admin
terraform import module.infrastructure.aws_s3_bucket_public_access_block.main_site ladurenko-prod-site
terraform import module.infrastructure.aws_s3_bucket_public_access_block.admin_portal ladurenko-prod-admin
terraform import module.infrastructure.aws_s3_bucket_versioning.main_site ladurenko-prod-site
terraform import module.infrastructure.aws_s3_bucket_versioning.admin_portal ladurenko-prod-admin
terraform import module.infrastructure.aws_s3_bucket_server_side_encryption_configuration.main_site ladurenko-prod-site
terraform import module.infrastructure.aws_s3_bucket_server_side_encryption_configuration.admin_portal ladurenko-prod-admin
```

#### 2. CloudFront Origin Access Controls

First, get the OAC IDs:
```bash
aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[].{Id:Id,Name:Name}" --output table
```

Then import:
```bash
terraform import module.infrastructure.aws_cloudfront_origin_access_control.main_site <MAIN_OAC_ID>
terraform import module.infrastructure.aws_cloudfront_origin_access_control.admin_portal <ADMIN_OAC_ID>
```

#### 3. CloudFront Function

```bash
terraform import module.infrastructure.aws_cloudfront_function.directory_handler ladurenko-prod-directory-handler
```

#### 4. IAM Role

```bash
terraform import module.infrastructure.aws_iam_role.lambda_role ladurenko-prod-lambda-role
terraform import module.infrastructure.aws_iam_role_policy_attachment.lambda_basic_execution "ladurenko-prod-lambda-role/arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
terraform import module.infrastructure.aws_iam_role_policy.lambda_s3_access "ladurenko-prod-lambda-role/ladurenko-prod-lambda-s3-access"
terraform import module.infrastructure.aws_iam_role_policy.lambda_dynamodb_access "ladurenko-prod-lambda-role/ladurenko-prod-lambda-dynamodb-access"
```

#### 5. DynamoDB Tables

```bash
terraform import module.infrastructure.aws_dynamodb_table.users ladurenko-prod-users
terraform import module.infrastructure.aws_dynamodb_table.orders ladurenko-prod-orders
terraform import module.infrastructure.aws_dynamodb_table.comments ladurenko-prod-comments
```

#### 6. Lambda Function

```bash
terraform import module.infrastructure.aws_lambda_function.admin_api ladurenko-prod-admin-api
```

#### 7. API Gateway

Get the API ID first:
```bash
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='ladurenko-prod-admin-api'].id" --output text)
```

Then import:
```bash
terraform import module.infrastructure.aws_api_gateway_rest_api.admin_api $API_ID

# Get resource IDs
ROOT_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/'].id" --output text)
PROXY_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/{proxy+}'].id" --output text)

# Import resources and methods
terraform import module.infrastructure.aws_api_gateway_method.proxy_root "$API_ID/$ROOT_RESOURCE_ID/ANY"
terraform import module.infrastructure.aws_api_gateway_integration.lambda_root "$API_ID/$ROOT_RESOURCE_ID/ANY"
terraform import module.infrastructure.aws_api_gateway_resource.proxy "$API_ID/$PROXY_RESOURCE_ID"
terraform import module.infrastructure.aws_api_gateway_method.proxy "$API_ID/$PROXY_RESOURCE_ID/ANY"
terraform import module.infrastructure.aws_api_gateway_integration.lambda "$API_ID/$PROXY_RESOURCE_ID/ANY"

# Import deployment and stage
DEPLOYMENT_ID=$(aws apigateway get-stages --rest-api-id $API_ID --query "item[0].deploymentId" --output text)
terraform import module.infrastructure.aws_api_gateway_deployment.admin_api "$API_ID/$DEPLOYMENT_ID"
terraform import module.infrastructure.aws_api_gateway_stage.admin_api "$API_ID/prod"
```

#### 8. CloudFront Distributions

Get distribution IDs:
```bash
aws cloudfront list-distributions --query "DistributionList.Items[].{Id:Id,Comment:Comment}" --output table
```

Then import:
```bash
terraform import module.infrastructure.aws_cloudfront_distribution.main_site <MAIN_DIST_ID>
terraform import module.infrastructure.aws_cloudfront_distribution.admin_portal <ADMIN_DIST_ID>
```

## After Import

1. Run `terraform plan` to see what Terraform wants to change
2. Review the plan carefully - some differences are expected
3. Run `terraform apply` to sync the configuration with the imported resources

## Troubleshooting

- **Resource already exists in state**: The resource is already imported, you can skip it
- **Resource not found**: The resource doesn't exist in AWS, Terraform will create it on apply
- **Import ID format error**: Check the Terraform documentation for the correct import ID format for that resource type

## Notes

- Importing doesn't modify the actual AWS resources, it only adds them to Terraform state
- After import, run `terraform plan` to see if the configuration matches the actual resources
- Some resources may show as needing updates - this is normal if the Terraform config differs slightly

