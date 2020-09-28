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
