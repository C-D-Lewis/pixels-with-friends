resource "aws_route53_record" "server_record" {
  zone_id = var.zone_id
  name    = "${var.project_name}-api.chrislewis.me.uk"
  type    = "A"

  alias {
    name                   = aws_lb.server_alb.dns_name
    zone_id                = aws_lb.server_alb.zone_id
    evaluate_target_health = false
  }
}
