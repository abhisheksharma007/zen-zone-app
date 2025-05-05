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

# Determine environment
ENV=${1:-production}
echo "🚀 Starting $ENV deployment process..."

# Validate environment-specific .env file exists
if [ ! -f ".env.$ENV" ]; then
    echo "❌ Error: .env.$ENV file not found!"
    exit 1
fi

# Clean install dependencies
echo "🧹 Cleaning node_modules and reinstalling dependencies..."
rm -rf node_modules
npm ci

# Build the application with environment-specific optimizations
echo "🔨 Building the application for $ENV..."
NODE_ENV=$ENV npm run build || {
    echo "❌ Error: Build failed"
    exit 1
}

# Run environment-specific tests if available
if [ -f "package.json" ] && grep -q "\"test:$ENV\":" "package.json"; then
    echo "🧪 Running $ENV tests..."
    npm run test:$ENV || {
        echo "❌ Error: Tests failed"
        exit 1
    }
fi

# Create a deployment package
echo "📦 Creating deployment package..."
zip -r deploy.zip dist server.js package.json package-lock.json .env.$ENV || {
    echo "❌ Error: Failed to create deployment package"
    exit 1
}

# Upload to EC2
echo "📤 Uploading to EC2 instance..."
scp -i "$SSH_KEY_PATH" deploy.zip "$EC2_USER@$EC2_HOST:~/" || {
    echo "❌ Error: Failed to upload to EC2"
    exit 1
}

# SSH into EC2 and deploy
echo "🔧 Deploying on EC2 instance..."
ssh -i "$SSH_KEY_PATH" "$EC2_USER@$EC2_HOST" << 'ENDSSH'
  # Create backup of current deployment
  echo "📦 Creating backup of current deployment..."
  if [ -d "dist" ]; then
    backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    cp -r dist server.js package.json package-lock.json .env* "$backup_dir" 2>/dev/null || true
  fi

  echo "🧹 Cleaning up old deployment..."
  rm -rf dist
  
  echo "📦 Extracting new deployment..."
  unzip -o deploy.zip || {
    echo "❌ Error: Failed to extract deployment package"
    exit 1
  }
  
  echo "📚 Installing production dependencies..."
  npm ci --production || {
    echo "❌ Error: Failed to install dependencies"
    exit 1
  }
  
  echo "🔄 Restarting application..."
  if ! pm2 restart server; then
    echo "⚠️ Server not found, starting new instance..."
    pm2 start server.js --name "zen-zone" --env $ENV || {
      echo "❌ Error: Failed to start server"
      exit 1
    }
  fi
  
  echo "💾 Saving PM2 process list..."
  pm2 save
  sudo env PATH=$PATH:/usr/bin pm2 startup amazon -u ec2-user --hp /home/ec2-user
  
  echo "🧹 Cleaning up deployment files..."
  rm deploy.zip
  
  echo "✅ $ENV deployment completed successfully!"
ENDSSH

# Clean up local deployment package
echo "🧹 Cleaning up local files..."
rm deploy.zip

echo "🎉 $ENV deployment process completed!"

# Make the deploy script executable
chmod +x deploy.sh