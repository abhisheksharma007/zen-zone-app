#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    echo "📦 Loading environment variables from .env file..."
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Validate required environment variables
if [ -z "$EC2_HOST" ] || [ -z "$EC2_USER" ] || [ -z "$SSH_KEY_PATH" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please ensure EC2_HOST, EC2_USER, and SSH_KEY_PATH are set in .env file"
    exit 1
fi

# Validate SSH key exists
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "❌ Error: SSH key not found at $SSH_KEY_PATH"
    exit 1
fi

# SSH into EC2 and deploy
echo "🔧 Deploying on EC2 instance..."
ssh -i "$SSH_KEY_PATH" "$EC2_USER@$EC2_HOST" << 'ENDSSH'
  echo "📂 Navigating to zen-zone-app directory..."
  cd /home/ec2-user/zen-zone-app || {
    echo "❌ Error: Failed to navigate to zen-zone-app directory"
    exit 1
  }

  echo "📥 Pulling latest changes..."
  git pull origin main || {
    echo "❌ Error: Failed to pull latest changes"
    exit 1
  }

  echo "🧹 Cleaning node_modules and reinstalling dependencies..."
  rm -rf node_modules
  npm ci --production || {
    echo "❌ Error: Failed to install dependencies"
    exit 1
  }

  echo "🔨 Building production build..."
  npm run build:prod || {
    echo "❌ Error: Build failed"
    exit 1
  }

  echo "🔄 Restarting application..."
  if pm2 list | grep -q "zen-zone"; then
    echo "🔄 Restarting existing PM2 process..."
    pm2 restart zen-zone || {
      echo "❌ Error: Failed to restart PM2 process"
      exit 1
    }
  else
    echo "🚀 Starting new PM2 process..."
    pm2 start "serve -s dist -l 3000" --name "zen-zone" || {
      echo "❌ Error: Failed to start PM2 process"
      exit 1
    }
  fi
  
  echo "💾 Saving PM2 process list..."
  pm2 save
  sudo env PATH=$PATH:/usr/bin pm2 startup amazon -u ec2-user --hp /home/ec2-user
  
  echo "✅ Deployment completed successfully!"
ENDSSH

echo "🎉 Deployment process completed!"

# Make the deploy script executable
chmod +x deploy.sh