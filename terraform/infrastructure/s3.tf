resource "aws_s3_bucket" "client_bucket" {
  bucket        = "${var.project_name}-client"
  acl           = "public-read"
  force_destroy = true
}
