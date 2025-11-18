#!/bin/bash
# Script to fix CloudFront Access Denied errors
# This ensures S3 bucket policies are correctly configured for OAC

set -e

ENVIRONMENT="prod"
PROJECT_NAME="ladurenko"
AWS_REGION="eu-central-1"

echo "Fixing CloudFront Access Denied errors..."
echo ""

# Get CloudFront distribution ARNs
echo "Getting CloudFront distribution ARNs..."
MAIN_DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment==\`${PROJECT_NAME}-${ENVIRONMENT}-main-site\`].Id" --output text 2>/dev/null || echo "")
ADMIN_DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment==\`${PROJECT_NAME}-${ENVIRONMENT}-admin-portal\`].Id" --output text 2>/dev/null || echo "")

if [ -z "$MAIN_DIST_ID" ] || [ "$MAIN_DIST_ID" == "None" ]; then
  echo "Error: Main site CloudFront distribution not found"
  exit 1
fi

if [ -z "$ADMIN_DIST_ID" ] || [ "$ADMIN_DIST_ID" == "None" ]; then
  echo "Error: Admin portal CloudFront distribution not found"
  exit 1
fi

MAIN_DIST_ARN=$(aws cloudfront get-distribution --id "$MAIN_DIST_ID" --query 'Distribution.ARN' --output text)
ADMIN_DIST_ARN=$(aws cloudfront get-distribution --id "$ADMIN_DIST_ID" --query 'Distribution.ARN' --output text)

echo "Main site distribution ARN: $MAIN_DIST_ARN"
echo "Admin portal distribution ARN: $ADMIN_DIST_ARN"
echo ""

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Update main site bucket policy
echo "Updating main site bucket policy..."
MAIN_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-site"
MAIN_BUCKET_ARN="arn:aws:s3:::${MAIN_BUCKET}"

cat > /tmp/main-bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "${MAIN_BUCKET_ARN}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "${MAIN_DIST_ARN}"
        }
      }
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket "$MAIN_BUCKET" --policy file:///tmp/main-bucket-policy.json
echo "✓ Main site bucket policy updated"

# Update admin portal bucket policy
echo "Updating admin portal bucket policy..."
ADMIN_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-admin"
ADMIN_BUCKET_ARN="arn:aws:s3:::${ADMIN_BUCKET}"

cat > /tmp/admin-bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "${ADMIN_BUCKET_ARN}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "${ADMIN_DIST_ARN}"
        }
      }
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket "$ADMIN_BUCKET" --policy file:///tmp/admin-bucket-policy.json
echo "✓ Admin portal bucket policy updated"

echo ""
echo "Bucket policies updated successfully!"
echo ""
echo "Note: If you still see Access Denied errors, it might be because:"
echo "  1. The S3 buckets are empty (no files deployed yet)"
echo "  2. CloudFront cache needs to be invalidated"
echo "  3. Wait a few minutes for changes to propagate"
echo ""
echo "To check if buckets have files:"
echo "  aws s3 ls s3://${MAIN_BUCKET}/"
echo "  aws s3 ls s3://${ADMIN_BUCKET}/"

