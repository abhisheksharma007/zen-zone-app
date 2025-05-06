
# Database Migrations

This directory contains all database migrations for the Zen Zone application.

## How to run migrations

1. Connect to your Supabase project
2. Navigate to the SQL Editor in the Supabase Dashboard
3. Copy the contents of each migration file and execute them in sequence
4. Or use the migration runner script: `npm run migrations:run`

## Migration files

Migrations are numbered sequentially with a prefix (e.g., `001_`, `002_`). 
Each migration should be applied only once and in the correct order.
