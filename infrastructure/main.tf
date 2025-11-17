provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# S3 bucket for main site
resource "aws_s3_bucket" "main_site" {
  bucket = "${var.project_name}-${var.environment}-site"

  tags = {
    Name        = "${var.project_name}-${var.environment}-site"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_s3_bucket_public_access_block" "main_site" {
  bucket = aws_s3_bucket.main_site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "main_site" {
  bucket = aws_s3_bucket.main_site.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main_site" {
  bucket = aws_s3_bucket.main_site.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 bucket for admin portal
resource "aws_s3_bucket" "admin_portal" {
  bucket = "${var.project_name}-${var.environment}-admin"

  tags = {
    Name        = "${var.project_name}-${var.environment}-admin"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_s3_bucket_public_access_block" "admin_portal" {
  bucket = aws_s3_bucket.admin_portal.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "admin_portal" {
  bucket = aws_s3_bucket.admin_portal.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "admin_portal" {
  bucket = aws_s3_bucket.admin_portal.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "main_site" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "OAC for ${var.project_name} main site"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "admin_portal" {
  name                              = "${var.project_name}-${var.environment}-admin-oac"
  description                       = "OAC for ${var.project_name} admin portal"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}


# CloudFront function for directory handling only
resource "aws_cloudfront_function" "directory_handler" {
  name    = "${var.project_name}-${var.environment}-directory-handler"
  runtime = "cloudfront-js-1.0"
  comment = "Handle directory requests by appending index.html"
  publish = true
  code    = file("${path.module}/cloudfront-function.js")
}

# CloudFront distribution for main site
resource "aws_cloudfront_distribution" "main_site" {
  origin {
    domain_name              = aws_s3_bucket.main_site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.main_site.id
    origin_id                = "S3-${aws_s3_bucket.main_site.bucket}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main_site.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    # CloudFront function for directory handling only
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.directory_handler.arn
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  # Cache behavior for static assets
  ordered_cache_behavior {
    path_pattern           = "/_nuxt/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main_site.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  # Cache behavior for images
  ordered_cache_behavior {
    path_pattern           = "*.jpg"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main_site.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  ordered_cache_behavior {
    path_pattern           = "*.jpeg"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main_site.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  ordered_cache_behavior {
    path_pattern           = "*.png"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main_site.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  ordered_cache_behavior {
    path_pattern           = "*.gif"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main_site.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  ordered_cache_behavior {
    path_pattern           = "*.webp"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main_site.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  ordered_cache_behavior {
    path_pattern           = "*.svg"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main_site.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  ordered_cache_behavior {
    path_pattern           = "*.ico"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.main_site.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 31536000
    max_ttl     = 31536000
  }


  # Error pages
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  price_class = var.cloudfront_price_class

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    # cloudfront_default_certificate = var.certificate_arn == "" ? true : false
    # acm_certificate_arn            = var.certificate_arn != "" ? var.certificate_arn : null
    # ssl_support_method             = var.certificate_arn != "" ? "sni-only" : null
  }

  # aliases = var.domain_name != "" ? [var.domain_name] : null

  tags = {
    Name        = "${var.project_name}-${var.environment}-main-site"
    Environment = var.environment
    Project     = var.project_name
  }
}

# CloudFront distribution for admin portal
resource "aws_cloudfront_distribution" "admin_portal" {
  origin {
    domain_name              = aws_s3_bucket.admin_portal.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.admin_portal.id
    origin_id                = "S3-${aws_s3_bucket.admin_portal.bucket}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.admin_portal.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  # Cache behavior for Vite static assets
  ordered_cache_behavior {
    path_pattern           = "/assets/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.admin_portal.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  # Error pages
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  price_class = var.cloudfront_price_class

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    # cloudfront_default_certificate = var.admin_certificate_arn == "" ? true : false
    # acm_certificate_arn            = var.admin_certificate_arn != "" ? var.admin_certificate_arn : null
    # ssl_support_method             = var.admin_certificate_arn != "" ? "sni-only" : null
  }

  # aliases = var.admin_domain_name != "" ? [var.admin_domain_name] : null

  tags = {
    Name        = "${var.project_name}-${var.environment}-admin-portal"
    Environment = var.environment
    Project     = var.project_name
  }
}

# S3 bucket policies for CloudFront access
resource "aws_s3_bucket_policy" "main_site" {
  bucket = aws_s3_bucket.main_site.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.main_site.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.main_site.arn
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "admin_portal" {
  bucket = aws_s3_bucket.admin_portal.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.admin_portal.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.admin_portal.arn
          }
        }
      }
    ]
  })
}

# Lambda function for admin API
resource "aws_lambda_function" "admin_api" {
  filename         = var.lambda_zip_path
  function_name    = "${var.project_name}-${var.environment}-admin-api"
  role             = aws_iam_role.lambda_role.arn
  handler          = "lambda.handler"
  source_code_hash = filebase64sha256(var.lambda_zip_path)
  runtime          = "nodejs22.x"
  timeout          = 30

  environment {
    variables = {
      NODE_ENV     = var.environment
      USERS_TABLE  = aws_dynamodb_table.users.name
      ORDERS_TABLE = aws_dynamodb_table.orders.name
      COMMENTS_TABLE = aws_dynamodb_table.comments.name
      BASE_URL     = var.base_url
      GOOGLE_ANALYTICS_ID = var.google_analytics_id
      GOOGLE_ADS_ID = var.google_ads_id
      GOOGLE_ADS_CONVERSION_ID = var.google_ads_conversion_id
    }
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-admin-api"
    Environment = var.environment
    Project     = var.project_name
  }
}

# API Gateway
resource "aws_api_gateway_rest_api" "admin_api" {
  name        = "${var.project_name}-${var.environment}-admin-api"
  description = "Admin API for ${var.project_name}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-admin-api"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.admin_api.id
  parent_id   = aws_api_gateway_rest_api.admin_api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.admin_api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.admin_api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.admin_api.invoke_arn
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.admin_api.id
  resource_id   = aws_api_gateway_rest_api.admin_api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id = aws_api_gateway_rest_api.admin_api.id
  resource_id = aws_api_gateway_rest_api.admin_api.root_resource_id
  http_method = aws_api_gateway_method.proxy_root.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.admin_api.invoke_arn
}

resource "aws_api_gateway_deployment" "admin_api" {
  depends_on = [
    aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.admin_api.id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "admin_api" {
  deployment_id = aws_api_gateway_deployment.admin_api.id
  rest_api_id   = aws_api_gateway_rest_api.admin_api.id
  stage_name    = var.environment

  tags = {
    Name        = "${var.project_name}-${var.environment}-admin-api-stage"
    Environment = var.environment
    Project     = var.project_name
  }
}

# API Gateway Custom Domain (optional)
# resource "aws_api_gateway_domain_name" "admin_api" {
#   count                    = var.api_domain_name != "" ? 1 : 0
#   domain_name              = var.api_domain_name
#   regional_certificate_arn = var.api_certificate_arn
#
#   endpoint_configuration {
#     types = ["REGIONAL"]
#   }
#
#   tags = {
#     Name        = "${var.project_name}-${var.environment}-api-domain"
#     Environment = var.environment
#     Project     = var.project_name
#   }
# }
#
# # API Gateway Base Path Mapping (optional)
# resource "aws_api_gateway_base_path_mapping" "admin_api" {
#   count       = var.api_domain_name != "" ? 1 : 0
#   api_id      = aws_api_gateway_rest_api.admin_api.id
#   stage_name  = aws_api_gateway_stage.admin_api.stage_name
#   domain_name = aws_api_gateway_domain_name.admin_api[0].domain_name
# }

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.admin_api.execution_arn}/*/*"
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-${var.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-lambda-role"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# DynamoDB tables
# Users table - matches User entity
resource "aws_dynamodb_table" "users" {
  name         = "${var.project_name}-${var.environment}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "username"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "username-index"
    hash_key        = "username"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "email-index"
    hash_key        = "email"
    projection_type = "ALL"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-users"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Orders table - matches Order entity
resource "aws_dynamodb_table" "orders" {
  name         = "${var.project_name}-${var.environment}-orders"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-orders"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Comments table - matches Comment entity
resource "aws_dynamodb_table" "comments" {
  name         = "${var.project_name}-${var.environment}-comments"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-comments"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Additional Lambda permissions for S3 access
resource "aws_iam_role_policy" "lambda_s3_access" {
  name = "${var.project_name}-${var.environment}-lambda-s3-access"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.main_site.arn,
          "${aws_s3_bucket.main_site.arn}/*",
          aws_s3_bucket.admin_portal.arn,
          "${aws_s3_bucket.admin_portal.arn}/*"
        ]
      }
    ]
  })
}

# DynamoDB permissions for Lambda
resource "aws_iam_role_policy" "lambda_dynamodb_access" {
  name = "${var.project_name}-${var.environment}-lambda-dynamodb-access"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:DescribeTable",
          "dynamodb:ListTables"
        ]
        Resource = [
          aws_dynamodb_table.users.arn,
          "${aws_dynamodb_table.users.arn}/index/*",
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*",
          aws_dynamodb_table.comments.arn,
          "${aws_dynamodb_table.comments.arn}/index/*"
        ]
      }
    ]
  })
}
