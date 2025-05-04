#!/bin/bash

# Build the application
npm run build

# Create a deployment package
zip -r deploy.zip dist server.js package.json package-lock.json

# Upload to EC2 (replace with your EC2 details)
scp -i /path/to/your-key.pem deploy.zip ec2-user@your-ec2-public-ip:~/

# SSH into EC2 and deploy
ssh -i /path/to/your-key.pem ec2-user@your-ec2-public-ip << 'ENDSSH'
  # Remove old deployment
  rm -rf dist
  
  # Unzip new deployment
  unzip -o deploy.zip
  
  # Install dependencies
  npm install --production
  
  # Restart the application with PM2
  pm2 restart server || pm2 start server.js --name "zen-zone"
  
  # Save PM2 process list and configure startup script
  pm2 save
  sudo env PATH=$PATH:/usr/bin pm2 startup amazon -u ec2-user --hp /home/ec2-user
  
  # Clean up
  rm deploy.zip
ENDSSH

# Clean up local deployment package
rm deploy.zip 