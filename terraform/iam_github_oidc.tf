# GitHub OIDC Provider for Identity-Based Authentication
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1", "1c58a3a8518e8759bf075b76b750d4f2df264fcd"] # Standard GitHub OIDC thumbprints
}

# IAM Role for GitHub Actions Deployment
resource "aws_iam_role" "github_deployment_role" {
  name = "dinevra-github-deployment-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" : "repo:ricky28chd/dinevra:*"
          }
        }
      }
    ]
  })
}

# Policy for S3 Frontend Deployment
resource "aws_iam_role_policy" "s3_deploy_policy" {
  name = "dinevra-s3-deploy-policy"
  role = aws_iam_role.github_deployment_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:s3:::app.dinevra.com",
          "arn:aws:s3:::app.dinevra.com/*"
        ]
      }
    ]
  })
}

# Policy for SSM EC2 Deployment (Run Command)
resource "aws_iam_role_policy" "ssm_deploy_policy" {
  name = "dinevra-ssm-deploy-policy"
  role = aws_iam_role.github_deployment_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ssm:SendCommand",
          "ssm:GetCommandInvocation"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:ec2:*:*:instance/*",
          "arn:aws:ssm:*:*:document/AWS-RunShellScript"
        ]
      }
    ]
  })
}

# Attach SSM Managed Policy to the EC2 Instance Profile (Role)
# This allows the EC2 instance to be managed by Systems Manager
resource "aws_iam_role_policy_attachment" "ec2_ssm_attachment" {
  role       = "dinevra_ec2_role" # Defined in your existing ec2_free_tier.tf
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

output "github_deployment_role_arn" {
  value = aws_iam_role.github_deployment_role.arn
}
