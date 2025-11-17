# Staging environment
terraform {
  backend "s3" {
    bucket = "lostal-terraform-state"
    key    = "staging/terraform.tfstate"
    region = "eu-central-1"
  }
}

module "infrastructure" {
  source = "../../"

  environment            = "staging"
  project_name           = "lostal"
  aws_region             = "eu-central-1"
  cloudfront_price_class = "PriceClass_100"
  base_url              = "https://staging.lostal.com.ua"
  google_analytics_id   = ""
  google_ads_id         = ""
  google_ads_conversion_id = ""
  
  # Custom domains (optional - set these if you have SSL certificates)
  # domain_name           = "staging.lostal.com.ua"
  # admin_domain_name     = "staging-admin.lostal.com.ua"
  # api_domain_name       = "staging-api.lostal.com.ua"
  
  # SSL certificate ARNs (optional - set these if you have certificates)
  # certificate_arn       = ""  # Set to your SSL certificate ARN for staging.lostal.com.ua
  # admin_certificate_arn = "" # Set to your SSL certificate ARN for staging-admin.lostal.com.ua
  # api_certificate_arn   = "" # Set to your SSL certificate ARN for staging-api.lostal.com.ua

  tags = {
    Environment = "staging"
    Owner       = "lostal-team"
  }
}

# Outputs from the module
output "main_site_cloudfront_url" {
  description = "CloudFront URL for the main site"
  value       = module.infrastructure.main_site_cloudfront_url
}

output "admin_portal_cloudfront_url" {
  description = "CloudFront URL for the admin portal"
  value       = module.infrastructure.admin_portal_cloudfront_url
}

output "api_gateway_url" {
  description = "API Gateway URL for the admin API"
  value       = module.infrastructure.api_gateway_url
}

output "main_site_bucket_name" {
  description = "Name of the main site S3 bucket"
  value       = module.infrastructure.main_site_bucket_name
}

output "admin_portal_bucket_name" {
  description = "Name of the admin portal S3 bucket"
  value       = module.infrastructure.admin_portal_bucket_name
}

output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = module.infrastructure.lambda_function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = module.infrastructure.lambda_function_arn
}

output "cloudfront_distribution_id_main" {
  description = "CloudFront distribution ID for main site"
  value       = module.infrastructure.cloudfront_distribution_id_main
}

output "cloudfront_distribution_id_admin" {
  description = "CloudFront distribution ID for admin portal"
  value       = module.infrastructure.cloudfront_distribution_id_admin
}

output "dynamodb_users_table_name" {
  description = "Name of the users DynamoDB table"
  value       = module.infrastructure.dynamodb_users_table_name
}

output "dynamodb_orders_table_name" {
  description = "Name of the orders DynamoDB table"
  value       = module.infrastructure.dynamodb_orders_table_name
}

output "dynamodb_comments_table_name" {
  description = "Name of the comments DynamoDB table"
  value       = module.infrastructure.dynamodb_comments_table_name
}

output "base_url" {
  description = "Base URL for the frontend application"
  value       = module.infrastructure.base_url
}

output "google_analytics_id" {
  description = "Google Analytics 4 Measurement ID"
  value       = module.infrastructure.google_analytics_id
}

output "google_ads_id" {
  description = "Google Ads Account ID"
  value       = module.infrastructure.google_ads_id
}

output "google_ads_conversion_id" {
  description = "Google Ads Conversion ID"
  value       = module.infrastructure.google_ads_conversion_id
}
