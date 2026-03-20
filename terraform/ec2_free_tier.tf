# Security Group to allow SSH, HTTP, HTTPS, WebSockets
resource "aws_security_group" "dinevra_ec2_sg" {
  name        = "dinevra_zero_cost_sg"
  description = "Allow HTTP, HTTPS, SSH, and Custom API Ports"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Consider restricting via IP
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080 # Go API Port
    to_port     = 8080
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

# Free Tier EC2 Instance (t2.micro / t3.micro check region availability)
resource "aws_instance" "dinevra_mvp_backend" {
  ami           = "ami-0c7217cdde317cfec" # Canonical Ubuntu 22.04 LTS (HVM), SSD Volume Type in us-east-1
  instance_type = "t2.micro"              # Eligible for AWS Free Tier

  vpc_security_group_ids = [aws_security_group.dinevra_ec2_sg.id]
  key_name               = "dinevra-keypair" # Assume user creates an SSH key pair

  user_data = file("${path.module}/user_data.sh")

  tags = {
    Name = "Dinevra-Backend-MVP"
  }
}

output "backend_public_ip" {
  value = aws_instance.dinevra_mvp_backend.public_ip
}
