variable "server_url" {
  type        = string
  description = "Backend server URL, including protocol"
  default     = "https://pwf-api.chrislewis.me.uk"
}

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
