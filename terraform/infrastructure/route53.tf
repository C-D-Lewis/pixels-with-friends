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

resource "aws_route53_record" "client_record" {
  zone_id = var.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.client_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.client_distribution.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_cloudfront_distribution.client_distribution]
}
