# AWS Region
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

# Instance Type
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

# Public Key for SSH access
variable "public_key" {
  description = "Public key for SSH access to the VM"
  type        = string
  default     = ""
}