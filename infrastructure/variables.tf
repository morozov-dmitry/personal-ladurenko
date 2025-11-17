variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "lostal"
}

variable "environment" {
  description = "Environment name (staging, prod)"
  type        = string
  validation {
    condition     = contains(["staging", "prod"], var.environment)
    error_message = "Environment must be one of: staging, prod."
  }
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.cloudfront_price_class)
    error_message = "CloudFront price class must be one of: PriceClass_All, PriceClass_200, PriceClass_100."
  }
}

variable "lambda_zip_path" {
  description = "Path to the Lambda function zip file"
  type        = string
  default     = "../../../admin-api/lambda-package.zip"
}

variable "domain_name" {
  description = "Domain name for the site (optional)"
  type        = string
  default     = ""
}

variable "admin_domain_name" {
  description = "Domain name for the admin portal (optional)"
  type        = string
  default     = ""
}

variable "api_domain_name" {
  description = "Domain name for the API Gateway (optional)"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate (optional, for custom domains)"
  type        = string
  default     = ""
}

variable "admin_certificate_arn" {
  description = "ARN of the SSL certificate for admin portal (optional, for custom domains)"
  type        = string
  default     = ""
}

variable "api_certificate_arn" {
  description = "ARN of the SSL certificate for API Gateway (optional, for custom domains)"
  type        = string
  default     = ""
}

variable "base_url" {
  description = "Base URL for the frontend application"
  type        = string
  default     = "https://lostal.com.ua"
}

variable "google_analytics_id" {
  description = "Google Analytics 4 Measurement ID"
  type        = string
  default     = "G-4VPGNB8DP8"
}

variable "google_ads_id" {
  description = "Google Ads Account ID"
  type        = string
  default     = "AW-11108238320"
}

variable "google_ads_conversion_id" {
  description = "Google Ads Conversion ID"
  type        = string
  default     = "AW-11108238320/KeM1CJqYso8YEPCH6bAp"
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}
