resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project_name}-ecs-cluster"
}

resource "aws_ecs_service" "ecs_service" {
  name                 = "${var.project_name}-ecs-service"
  cluster              = aws_ecs_cluster.ecs_cluster.id
  task_definition      = aws_ecs_task_definition.service_definition.arn
  desired_count        = 1
  launch_type          = "FARGATE"
  force_new_deployment = true

  load_balancer {
    target_group_arn = aws_lb_target_group.server_tg.arn
    container_name   = "${aws_ecr_repository.server_ecr.name}-container"
    container_port   = 5500
  }

  network_configuration {
    security_groups   = [aws_security_group.server_sg.id]
    subnets           = data.aws_subnet_ids.subnets.ids
    assign_public_ip = true
  }
}

resource "aws_ecs_task_definition" "service_definition" {
  family                   = "${aws_ecr_repository.server_ecr.name}-td"
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  requires_compatibilities = ["FARGATE"]
  container_definitions = <<DEFINITION
[
  {
    "image": "${aws_ecr_repository.server_ecr.repository_url}:latest",
    "name": "${aws_ecr_repository.server_ecr.name}-container",
    "essential": true,
    "environment": [],
    "portMappings": [{
      "protocol": "tcp",
      "containerPort": 5500,
      "hostPort": 5500
    }]
  }
]
DEFINITION
}
