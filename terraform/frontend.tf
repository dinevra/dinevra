# S3 Bucket for static React dashboard hosting
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.domain_name
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html" # React Router handles 404s
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_access" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
      },
    ]
  })
  
  depends_on = [aws_s3_bucket_public_access_block.frontend_access]
}

output "dashboard_s3_website_url" {
  value = aws_s3_bucket_website_configuration.frontend_website.website_endpoint
}

# --- MARKETING WEBSITE BUCKET ---

resource "aws_s3_bucket" "marketing_bucket" {
  bucket = var.marketing_domain_name
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "marketing_website" {
  bucket = aws_s3_bucket.marketing_bucket.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "marketing_access" {
  bucket = aws_s3_bucket.marketing_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "marketing_policy" {
  bucket = aws_s3_bucket.marketing_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObjectMarketing"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.marketing_bucket.arn}/*"
      },
    ]
  })
  
  depends_on = [aws_s3_bucket_public_access_block.marketing_access]
}

output "marketing_s3_website_url" {
  value = aws_s3_bucket_website_configuration.marketing_website.website_endpoint
}
# --- ROOT DOMAIN REDIRECT BUCKET (dinevra.com -> www) ---

resource "aws_s3_bucket" "root_bucket" {
  bucket = var.root_domain_name
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "root_website" {
  bucket = aws_s3_bucket.root_bucket.id

  redirect_all_requests_to {
    host_name = var.marketing_domain_name
    protocol  = "http"
  }
}

resource "aws_s3_bucket_public_access_block" "root_access" {
  bucket = aws_s3_bucket.root_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

output "root_s3_website_url" {
  value = aws_s3_bucket_website_configuration.root_website.website_endpoint
}
