# Terraform VM Demo

This Terraform configuration creates a simple VM instance on AWS for learning and demo purposes.

## What This Creates

- **VPC**: A virtual private cloud with CIDR 10.0.0.0/16
- **Subnet**: A public subnet with CIDR 10.0.1.0/24
- **Internet Gateway**: For internet access
- **Security Group**: Allows SSH (port 22), HTTP (port 80), and HTTPS (port 443)
- **EC2 Instance**: Amazon Linux 2 VM with a basic web server
- **Key Pair**: For SSH access to the VM

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install and configure AWS CLI with your credentials
3. **Terraform**: Install Terraform (version >= 1.0)
4. **SSH Key Pair**: Generate an SSH key pair for VM access

## Setup Instructions

### 1. Configure AWS Credentials
```bash
aws configure
```
Enter your AWS Access Key ID, Secret Access Key, and preferred region.

### 2. Generate SSH Key Pair (if you don't have one)
```bash
ssh-keygen -t rsa -b 2048 -f ~/.ssh/demo-key
```

### 3. Configure Variables
```bash
cp terraform.tfvars.example terraform.tfvars
```
Edit `terraform.tfvars` and add your SSH public key content:
```bash
cat ~/.ssh/demo-key.pub
```
Copy the output and paste it in the `public_key` variable.

### 4. Deploy the Infrastructure
```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
```

### 5. Access Your VM
After deployment, Terraform will output the connection details:
```bash
# SSH to your VM
ssh -i ~/.ssh/demo-key ec2-user@<PUBLIC_IP>

# Access the web server
curl http://<PUBLIC_IP>
```

## Cleanup

To destroy all resources and avoid charges:
```bash
terraform destroy
```

## Cost Considerations

- **t2.micro**: Free tier eligible (750 hours/month for first 12 months)
- **VPC, Subnet, IGW**: No additional charges
- **Data Transfer**: Minimal for demo purposes

## Security Notes

- The security group allows SSH access from anywhere (0.0.0.0/0)
- For production use, restrict SSH access to your IP address
- Always use strong SSH keys and keep them secure

## Customization

You can modify the following in `variables.tf`:
- `aws_region`: Change the deployment region
- `instance_type`: Use different instance sizes (t3.small, t3.medium, etc.)
- Security group rules in `main.tf` for different port access

## Troubleshooting

1. **Permission Denied**: Ensure your AWS credentials have EC2 permissions
2. **Key Pair Issues**: Verify your public key format is correct
3. **Region Issues**: Make sure the region supports the chosen instance type
4. **SSH Connection**: Check security group rules and key permissions

## Files Description

- `main.tf`: Main Terraform configuration
- `variables.tf`: Input variables definition
- `outputs.tf`: Output values after deployment
- `terraform.tfvars.example`: Example variables file
- `terraform-vm-demo-README.md`: This documentation