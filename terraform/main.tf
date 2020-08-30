module "main" {
  source       = "./infrastructure"
  server_url   = var.server_url
  region       = var.region
  project_name = var.project_name
}

provider "aws" {
  region = var.region
}

terraform {
  required_providers {
    aws = "~> 2.70"
  }

  backend "s3" {
    bucket  = "chrislewis.me.uk-tfstate"
    key     = "pixels-with-friends"
    region  = "us-east-1"
  }
}
