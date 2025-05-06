
# Database Setup Instructions

## Initial Setup

Before running the application, you need to set up the database:

1. Create a Supabase account if you don't have one
2. Create a new project in Supabase
3. Get your Supabase URL and keys from the project settings
4. Add them to your `.env` file:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Running Migrations

### Option 1: Manual Execution

1. Go to the SQL Editor in your Supabase dashboard
2. Execute the migration files in order:
   - First: `000_setup_execute_sql_function.sql`
   - Then: `001_initial_schema.sql`
   - Any additional migration files in numerical order

### Option 2: Automated Migration Runner

1. Ensure your `.env` file has the Supabase URL and service role key
2. Run:
   ```
   node scripts/run-migrations.js
   ```

## Adding New Migrations

When you need to make changes to the database schema:

1. Create a new SQL file in the `migrations` directory with a sequential number
2. Follow this naming convention: `003_descriptive_name.sql`
3. Include a header comment with migration number, description, and date
4. Use `CREATE TABLE IF NOT EXISTS` and similar patterns to make migrations idempotent
5. Run the migration using one of the methods above

## Migration Best Practices

- Always include `IF NOT EXISTS` or `IF EXISTS` in your migrations
- Drop triggers before recreating them to avoid errors
- Use `ON CONFLICT DO NOTHING` for seed data
- Include thorough comments explaining the purpose of each change
- Test migrations on a development database before applying to production
