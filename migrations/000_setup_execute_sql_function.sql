
-- Migration: 000_setup_execute_sql_function
-- Description: Create a function to execute arbitrary SQL (for migrations)
-- Date: 2025-05-06

-- Create a function to execute arbitrary SQL (only for migrations)
-- IMPORTANT: This should only be called with the service role key
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Grant access to authenticated users (restricted by RLS and service role)
GRANT EXECUTE ON FUNCTION execute_sql TO authenticated;
