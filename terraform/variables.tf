variable "region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Project name for all resources"
  default     = "pixels-with-friends"
}

variable "vpc_id" {
  type        = string
  description = "VPC to deploy into"
  default     = "vpc-c3b70bb9"
}

variable "zone_id" {
  type        = string
  description = "Route53 zone ID"
  default     = "Z05682866H59A0KFT8S"
}

variable "domain_name" {
  type        = string
  description = "Site domain name, matching client S3 bucket"
  default     = "pixels.chrislewis.me.uk"
}

variable "certificate_arn" {
  type        = string
  description = "Certificate ARN in ACM"
  default     = "arn:aws:acm:us-east-1:617929423658:certificate/a69e6906-579e-431d-9e4c-707877d325b7"
}
