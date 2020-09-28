resource "aws_lb" "server_alb" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.server_sg.id]
  subnets            = data.aws_subnet_ids.subnets.ids
}

resource "aws_lb_target_group" "server_tg" {
  name        = "${var.project_name}-tg"
  port        = 5500
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.selected.id
}

resource "aws_lb_listener" "server_alb_listener" {
  load_balancer_arn = aws_lb.server_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:617929423658:certificate/a69e6906-579e-431d-9e4c-707877d325b7"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.server_tg.arn
  }
}
