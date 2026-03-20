terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" # Can be changed via variable
}

variable "domain_name" {
  type        = string
  description = "Domain name for the frontend dashboard"
  default     = "app.dinevra.com"
}

variable "marketing_domain_name" {
  type        = string
  description = "Domain name for the marketing website"
  default     = "www.dinevra.com"
}
