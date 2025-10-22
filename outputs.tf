# Output the public IP address of the VM
output "vm_public_ip" {
  description = "Public IP address of the demo VM"
  value       = aws_instance.demo_vm.public_ip
}

# Output the private IP address of the VM
output "vm_private_ip" {
  description = "Private IP address of the demo VM"
  value       = aws_instance.demo_vm.private_ip
}

# Output the instance ID
output "vm_instance_id" {
  description = "Instance ID of the demo VM"
  value       = aws_instance.demo_vm.id
}

# Output SSH connection command
output "ssh_connection_command" {
  description = "SSH command to connect to the VM"
  value       = "ssh -i your-private-key.pem ec2-user@${aws_instance.demo_vm.public_ip}"
}

# Output the web URL
output "web_url" {
  description = "URL to access the web server"
  value       = "http://${aws_instance.demo_vm.public_ip}"
}