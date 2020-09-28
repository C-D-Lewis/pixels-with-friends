resource "aws_ecr_repository" "server_ecr" {
  name = "${var.project_name}-server-ecr"
}
