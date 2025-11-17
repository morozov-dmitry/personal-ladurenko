# Lostal Project CI/CD Setup

This repository contains a complete CI/CD setup for the Lostal legal office website using GitHub Actions.

## 🏗️ Architecture

- **Frontend**: Nuxt 3/4 application with Ukrainian/Russian i18n
- **Backend**: AWS Lambda + API Gateway + DynamoDB
- **Infrastructure**: Terraform with multi-environment support
- **Deployment**: GitHub Actions with automated CI/CD

## 🚀 Quick Start

### 1. Set Up AWS Credentials

Create an IAM user with the following policy:

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

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

### 3. Deploy Infrastructure

The CI/CD will automatically deploy when you push to:
- `develop` branch → Development environment
- `main` branch → Staging + Production environments

## 📁 Project Structure

```
lostal/
├── .github/workflows/          # GitHub Actions workflows
│   ├── deploy-infrastructure.yml
│   ├── deploy-frontend.yml
│   └── security.yml
├── front/                      # Nuxt frontend application
├── admin-api/                  # Lambda function source
├── infrastructure/             # Terraform configuration
│   ├── environments/           # Environment-specific configs
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   └── terraform-state/       # State management
├── scripts/                    # Deployment scripts
└── README.md
```

## 🔄 CI/CD Workflows

### Infrastructure Deployment
- **Trigger**: Push to `main`/`develop`, PRs to `main`
- **Features**:
  - Terraform plan validation on PRs
  - Automated infrastructure deployment
  - Lambda package building
  - Environment-specific deployments

### Frontend Deployment
- **Trigger**: Push to `main`/`develop`, PRs to `main`
- **Features**:
  - Build and test Nuxt application
  - Deploy to S3 buckets
  - CloudFront cache invalidation
  - Environment-specific deployments

### Security Scanning
- **Trigger**: Push, PRs, weekly schedule
- **Features**:
  - Terraform security scanning
  - Dependency vulnerability checks
  - Automated security reports

## 🌍 Environments

### Development (`develop` branch)
- **Purpose**: Feature development and testing
- **Deployment**: Automatic on push
- **Resources**: `lostal-dev-*`

### Staging (`main` branch)
- **Purpose**: Pre-production testing
- **Deployment**: Automatic on push
- **Resources**: `lostal-staging-*`

### Production (`main` branch)
- **Purpose**: Live production environment
- **Deployment**: Automatic on push (with optional manual approval)
- **Resources**: `lostal-prod-*`

## 🛠️ Manual Deployment

Use the deployment script for manual deployments:

```bash
# Deploy everything to development
./scripts/deploy.sh dev all

# Deploy only infrastructure to staging
./scripts/deploy.sh staging infrastructure

# Deploy only frontend to production
./scripts/deploy.sh prod frontend
```

## 📊 Monitoring

### GitHub Actions
- View deployment status in the **Actions** tab
- Check logs for any failures
- Review security scan results

### AWS Console
- Monitor CloudFormation stacks
- Check Lambda function logs
- Verify S3 bucket contents
- Review CloudFront distributions

## 🔧 Customization

### Environment Variables
Modify these in workflow files:
- `AWS_REGION`: Deployment region (default: eu-central-1)
- `TERRAFORM_VERSION`: Terraform version (default: 1.5.7)
- `NODE_VERSION`: Node.js version (default: 22)

### Branch Strategy
Change branch triggers in workflow files:
- Modify `main`/`develop` to your preferred branch names
- Add additional branches as needed

### Notification
Add Slack/Discord notifications by modifying workflow files.

## 🚨 Troubleshooting

### Common Issues

1. **AWS Credentials Error**
   - Verify secrets are correctly set in GitHub
   - Check IAM user permissions

2. **Terraform State Lock**
   - Ensure DynamoDB table exists
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

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Create a pull request to `main`
4. The CI/CD will validate your changes
5. Merge after review and approval

## 📞 Support

For issues with the CI/CD setup:
1. Check the GitHub Actions logs
2. Review the troubleshooting section
3. Check AWS CloudWatch logs
4. Contact the development team
