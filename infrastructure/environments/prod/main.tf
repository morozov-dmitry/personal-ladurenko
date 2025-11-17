# Production environment
terraform {
  backend "s3" {
    bucket = "lostal-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "eu-central-1"
  }
}

module "infrastructure" {
  source = "../../"

  environment            = "prod"
  project_name           = "lostal"
  aws_region             = "eu-central-1"
  cloudfront_price_class = "PriceClass_All"
  base_url              = "https://lostal.com.ua"
  google_analytics_id   = "G-4VPGNB8DP8"
  google_ads_id         = "AW-11108238320"
  google_ads_conversion_id = "AW-11108238320/KeM1CJqYso8YEPCH6bAp"
  
  # Custom domains (optional - set these if you have SSL certificates)
  # domain_name           = "lostal.com.ua"
  # admin_domain_name     = "admin.lostal.com.ua"
  # api_domain_name       = "api.lostal.com.ua"
  
  # SSL certificate ARNs
  # CloudFront requires us-east-1 certificates
  # certificate_arn       = "arn:aws:acm:us-east-1:294396590372:certificate/0e720d01-ac51-459a-8442-d339eadcf8c6"  # lostal.com.ua (ISSUED)
  # admin_certificate_arn = "arn:aws:acm:us-east-1:294396590372:certificate/96cd1553-1739-454a-9496-28b3f71d2fcf"  # admin.lostal.com.ua (ISSUED)
  # API Gateway Regional requires eu-central-1 certificate
  # api_certificate_arn   = "arn:aws:acm:eu-central-1:294396590372:certificate/17d7217e-05f1-4cab-82d9-e73bc79a6df8"  # api.lostal.com.ua (ISSUED)

  tags = {
    Environment = "production"
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
