module "main" {
  source           = "./infrastructure"
  region           = var.region
  project_name     = var.project_name
  vpc_id           = var.vpc_id
  zone_id          = var.zone_id
  domain_name      = var.domain_name
  certificate_arn  = var.certificate_arn
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
