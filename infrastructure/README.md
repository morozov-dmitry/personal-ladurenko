# Lostal Infrastructure

This directory contains the Terraform configuration for the Lostal legal office website infrastructure on AWS.

## Architecture

The infrastructure includes:

- **S3 Buckets**: Two buckets for hosting static sites
  - Main site bucket (lostal-{env}-site)
  - Admin portal bucket (lostal-{env}-admin)
- **CloudFront Distributions**: CDN for both sites with optimized caching
- **Lambda Function**: Admin API for content management
- **API Gateway**: REST API endpoint for the Lambda function
- **IAM Roles**: Proper permissions for Lambda to access S3

## Environments

The infrastructure supports multiple environments:
- `staging` - Staging environment  
- `prod` - Production environment

Each environment is isolated with separate resources and state files.

## Directory Structure

```
infrastructure/
├── main.tf                 # Main infrastructure resources
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── environments/           # Environment-specific configurations
│   ├── staging/
│   └── prod/
└── terraform-state/        # Terraform state bucket setup

admin-api/                  # Lambda function source code
├── index.js
├── package.json
└── build.sh
```

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** >= 1.0 installed
3. **Node.js** >= 18.0.0 for Lambda function

## Setup Instructions

### 1. Initialize Terraform State Backend

First, create the S3 bucket and DynamoDB table for Terraform state:

```bash
cd terraform-state
terraform init
terraform plan
terraform apply
```

### 2. Deploy Infrastructure

Choose an environment and deploy:

#### Staging Environment
```bash
cd environments/staging
terraform init
terraform plan
terraform apply
```

#### Production Environment
```bash
cd environments/prod
terraform init
terraform plan
terraform apply
```

### 3. Build and Deploy Lambda Function

```bash
cd admin-api
./build.sh
```

This creates `lambda-package.zip` which is referenced in the Terraform configuration.

## Configuration

### Variables

Key variables you can customize:

- `aws_region`: AWS region (default: us-east-1)
- `project_name`: Project name (default: lostal)
- `environment`: Environment name (staging/prod)
- `cloudfront_price_class`: CloudFront pricing tier
- `domain_name`: Custom domain for main site (optional)
- `admin_domain_name`: Custom domain for admin portal (optional)

### Custom Domains

To use custom domains:

1. Create SSL certificates in AWS Certificate Manager
2. Set `certificate_arn` and `admin_certificate_arn` variables
3. Set `domain_name` and `admin_domain_name` variables
4. Update CloudFront distributions to use the certificates

## Outputs

After deployment, Terraform outputs:

- `main_site_cloudfront_url`: CloudFront URL for main site
- `admin_portal_cloudfront_url`: CloudFront URL for admin portal
- `api_gateway_url`: API Gateway URL for admin API
- `lambda_function_name`: Lambda function name
- S3 bucket names for both sites

## Deployment Workflow

### Main Site Deployment

1. Build the Nuxt application:
   ```bash
   cd front
   npm run build
   ```

2. Upload to S3:
   ```bash
   aws s3 sync .output/public/ s3://lostal-{env}-site/ --delete
   ```

3. Invalidate CloudFront cache:
   ```bash
   aws cloudfront create-invalidation --distribution-id {distribution-id} --paths "/*"
   ```

### Admin Portal Deployment

1. Build admin portal (if separate)
2. Upload to admin S3 bucket
3. Invalidate admin CloudFront cache

### Lambda Function Updates

1. Update Lambda code in `admin-api/` directory
2. Run `./build.sh` to create new package
3. Update Terraform:
   ```bash
   terraform plan
   terraform apply
   ```

## Security

- S3 buckets are private with CloudFront OAC access only
- Lambda function has minimal required permissions
- All resources are tagged for cost tracking and management
- State files are encrypted and versioned

## Monitoring

Consider adding:
- CloudWatch alarms for Lambda errors
- CloudWatch dashboards for API metrics
- S3 access logging
- CloudFront access logs

## Cost Optimization

- Staging uses PriceClass_100 (US, Canada, Europe)
- Production uses PriceClass_All (global)
- S3 lifecycle policies can be added for old versions
- Lambda provisioned concurrency for production

## Troubleshooting

### Common Issues

1. **Lambda deployment fails**: Ensure `lambda-package.zip` exists
2. **CloudFront not updating**: Check cache behaviors and invalidate
3. **S3 access denied**: Verify OAC configuration
4. **API Gateway CORS**: Check Lambda response headers

### Useful Commands

```bash
# Check Lambda logs
aws logs tail /aws/lambda/lostal-{env}-admin-api --follow

# Test API Gateway
curl https://{api-id}.execute-api.{region}.amazonaws.com/{env}/

# Check S3 bucket contents
aws s3 ls s3://lostal-{env}-site/
```

## Next Steps

1. Set up CI/CD pipeline for automated deployments
2. Add monitoring and alerting
3. Implement custom domains with SSL certificates
4. Add database integration for Lambda function
5. Set up backup and disaster recovery procedures
