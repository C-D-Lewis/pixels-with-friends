resource "aws_ecr_repository" "server_repo" {
  name = "${var.project_name}-server-ecr"
}
