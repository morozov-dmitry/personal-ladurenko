output "main_site_bucket_name" {
  description = "Name of the main site S3 bucket"
  value       = aws_s3_bucket.main_site.bucket
}

output "admin_portal_bucket_name" {
  description = "Name of the admin portal S3 bucket"
  value       = aws_s3_bucket.admin_portal.bucket
}

output "main_site_cloudfront_url" {
  description = "CloudFront URL for the main site"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.main_site.domain_name}"
}

output "admin_portal_cloudfront_url" {
  description = "CloudFront URL for the admin portal"
  value       = var.admin_domain_name != "" ? "https://${var.admin_domain_name}" : "https://${aws_cloudfront_distribution.admin_portal.domain_name}"
}

output "api_gateway_url" {
  description = "API Gateway URL for the admin API"
  value       = var.api_domain_name != "" ? "https://${var.api_domain_name}" : "https://${aws_api_gateway_rest_api.admin_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_stage.admin_api.stage_name}"
}

output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.admin_api.function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.admin_api.arn
}

output "cloudfront_distribution_id_main" {
  description = "CloudFront distribution ID for main site"
  value       = aws_cloudfront_distribution.main_site.id
}

output "dynamodb_users_table_name" {
  description = "Name of the users DynamoDB table"
  value       = aws_dynamodb_table.users.name
}

output "dynamodb_orders_table_name" {
  description = "Name of the orders DynamoDB table"
  value       = aws_dynamodb_table.orders.name
}

output "dynamodb_comments_table_name" {
  description = "Name of the comments DynamoDB table"
  value       = aws_dynamodb_table.comments.name
}

output "cloudfront_distribution_id_admin" {
  description = "CloudFront distribution ID for admin portal"
  value       = aws_cloudfront_distribution.admin_portal.id
}

output "base_url" {
  description = "Base URL for the frontend application"
  value       = var.base_url
}

output "google_analytics_id" {
  description = "Google Analytics 4 Measurement ID"
  value       = var.google_analytics_id
}

output "google_ads_id" {
  description = "Google Ads Account ID"
  value       = var.google_ads_id
}

output "google_ads_conversion_id" {
  description = "Google Ads Conversion ID"
  value       = var.google_ads_conversion_id
}
