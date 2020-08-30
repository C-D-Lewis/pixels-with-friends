resource "aws_s3_bucket" "client_source_bucket" {
  bucket        = "${var.project_name}-client-bucket"
  acl           = "public-read"
  force_destroy = true
}
