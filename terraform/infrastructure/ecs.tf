resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project_name}-ecs-cluster"
}

resource "aws_ecs_service" "ecs_service" {
  name            = "${var.project_name}-ecs-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = data.template_file.service_td.rendered
  desired_count   = 1
}

data "template_file" "service_td" {
  template = file("templates/service_td.json")

  vars = {
    container_name = "${aws_ecr_repository.server_ecr.name}-container"
    image_url = "${aws_ecr_repository.server_ecr.repository_url}:master"
  }
}
