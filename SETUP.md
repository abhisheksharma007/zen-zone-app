
# Zen Zone - Setup Guide

This guide will help you set up and run the Zen Zone application with your own Supabase database.

## Prerequisites

- Node.js 18+ and npm installed
- Supabase account and a project created
- Service role key from your Supabase project

## Setup Steps

### 1. Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration
VITE_ZOHO_MAIL_HOST=smtp.zoho.com
VITE_ZOHO_MAIL_PORT=587
VITE_ZOHO_MAIL_USER=your_zoho_email@example.com
VITE_ZOHO_MAIL_PASS=your_zoho_password
VITE_EMAIL_FROM=your_from_email@example.com

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
VITE_API_URL=https://your-api-url.com
VITE_APP_URL=http://localhost:8080
VITE_LOG_LEVEL=info

# Deployment (only needed for EC2 deployment)
EC2_HOST=your_ec2_host
EC2_USER=ec2-user
SSH_KEY_PATH=/path/to/your/ssh/key.pem
```

### 2. Database Setup

There are two ways to set up the database:

#### Option 1: Manual SQL Execution

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Open each migration file in the `migrations` directory
4. Execute them in order (001_initial_schema.sql, etc.)

#### Option 2: Using the Migration Runner (Requires Service Role Key)

1. Make sure you've set the `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file
2. Install the required dependencies:
   ```
   npm install
   ```
3. Run the migration script:
   ```
   node scripts/run-migrations.js
   ```

### 3. Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. The application should now be running at http://localhost:8080

### 4. Building for Production

To build the application for production:

```
npm run build
```

### 5. Deployment

To deploy to an EC2 instance using the included deploy script:

```
chmod +x deploy.sh
./deploy.sh
```

## Adding New Migrations

When making database changes:

1. Create a new numbered migration file in the `migrations` directory (e.g., `002_add_new_table.sql`)
2. Follow the pattern in existing migration files
3. Run the migration using one of the methods described above
