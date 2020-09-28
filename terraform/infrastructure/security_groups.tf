resource "aws_security_group" "server_sg" {
  name        = "${var.project_name}-sg"
  description = "Allow inbound traffic to API server"
  vpc_id      = data.aws_vpc.selected.id

  ingress {
    description = "From VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "From VPC"
    from_port   = 5500
    to_port     = 5500
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
