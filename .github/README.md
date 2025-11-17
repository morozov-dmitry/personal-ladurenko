# GitHub Actions CI/CD Setup

This document explains how to set up CI/CD for the Lostal project using GitHub Actions.

## 🚀 Workflows Overview

### 1. **Deploy Infrastructure** (`.github/workflows/deploy-infrastructure.yml`)
- **Triggers**: Push to `main`/`develop`, PRs to `main`
- **Jobs**:
  - `terraform-plan`: Validates infrastructure changes in PRs
  - `build-lambda`: Builds Lambda package for deployments
  - `deploy-dev`: Deploys to development environment
  - `deploy-staging`: Deploys to staging environment  
  - `deploy-prod`: Deploys to production environment

### 2. **Deploy Frontend** (`.github/workflows/deploy-frontend.yml`)
- **Triggers**: Push to `main`/`develop`, PRs to `main`
- **Jobs**:
  - `build-and-test`: Builds and tests the Nuxt frontend
  - `deploy-dev-frontend`: Deploys frontend to development
  - `deploy-staging-frontend`: Deploys frontend to staging
  - `deploy-prod-frontend`: Deploys frontend to production

### 3. **Security Scan** (`.github/workflows/security.yml`)
- **Triggers**: Push, PRs, weekly schedule
- **Jobs**:
  - `terraform-security`: Scans Terraform for security issues
  - `dependency-check`: Audits npm dependencies

## 🔐 Required GitHub Secrets

Set these secrets in your GitHub repository settings:

### AWS Credentials
```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### Optional: AWS Session Token (if using temporary credentials)
```
AWS_SESSION_TOKEN=your-session-token
```

## 🌍 Environment Protection Rules

Set up environment protection rules in GitHub:

### Development Environment
- **Branch**: `develop`
- **Protection**: None (auto-deploy)

### Staging Environment  
- **Branch**: `main`
- **Protection**: Require review (optional)

### Production Environment
- **Branch**: `main`
- **Protection**: Require review + manual approval

## 📋 Setup Instructions

### 1. Create AWS IAM User for CI/CD

Create a dedicated IAM user with these policies:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "cloudfront:*",
                "dynamodb:*",
                "lambda:*",
                "apigateway:*",
                "iam:*",
                "sts:GetCallerIdentity"
            ],
            "Resource": "*"
        }
    ]
}
```

### 2. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### 3. Set Up Environment Protection (Optional)

1. Go to **Settings** → **Environments**
2. Create environments: `development`, `staging`, `production`
3. Configure protection rules as needed

## 🔄 Deployment Flow

### Development Flow
```
develop branch → Deploy to Development
```

### Production Flow
```
main branch → Deploy to Staging + Production
```

### Pull Request Flow
```
PR to main → Terraform Plan + Security Scan
```

## 📊 Monitoring Deployments

### GitHub Actions Dashboard
- View deployment status in **Actions** tab
- Check logs for any failures
- Review security scan results

### AWS Console
- Monitor CloudFormation stacks
- Check Lambda function logs
- Verify S3 bucket contents

## 🛠️ Manual Deployment

If you need to deploy manually:

### Infrastructure
```bash
# Development
cd infrastructure/environments/dev
terraform apply

# Staging  
cd infrastructure/environments/staging
terraform apply

# Production
cd infrastructure/environments/prod
terraform apply
```

### Frontend
```bash
# Build
cd front
npm run build

# Deploy to S3
aws s3 sync .output/public/ s3://lostal-dev-site/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Customization

### Environment Variables
Modify environment variables in workflow files:
- `AWS_REGION`: Change deployment region
- `TERRAFORM_VERSION`: Update Terraform version
- `NODE_VERSION`: Update Node.js version (default: 22)

### Branch Strategy
Modify branch triggers in workflow files:
- Change `main`/`develop` to your preferred branch names
- Add additional branches as needed

### Notification
Add Slack/Discord notifications:
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🚨 Troubleshooting

### Common Issues

1. **AWS Credentials Error**
   - Verify secrets are correctly set
   - Check IAM user permissions

2. **Terraform State Lock**
   - Check DynamoDB table exists
   - Verify S3 bucket permissions

3. **Lambda Deployment Failed**
   - Check Lambda package size (< 50MB)
   - Verify Node.js runtime compatibility

4. **CloudFront Invalidation Failed**
   - Check distribution ID is correct
   - Verify CloudFront permissions

### Debug Commands
```bash
# Check AWS credentials
aws sts get-caller-identity

# List S3 buckets
aws s3 ls

# Check Terraform state
terraform show
```

## 📈 Best Practices

1. **Security**
   - Use least-privilege IAM policies
   - Rotate AWS credentials regularly
   - Enable MFA for production deployments

2. **Monitoring**
   - Set up CloudWatch alarms
   - Monitor deployment metrics
   - Track error rates

3. **Backup**
   - Enable S3 versioning
   - Backup DynamoDB tables
   - Keep Terraform state backups

4. **Testing**
   - Test in development first
   - Use staging for integration tests
   - Validate production deployments
