
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Migration tracking table
async function ensureMigrationTable() {
  console.log('Ensuring migration tracking table exists...');
  
  const { error } = await supabase.rpc('execute_sql', {
    sql_query: `
      CREATE TABLE IF NOT EXISTS public._migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  
  if (error) {
    console.error('Error creating migration table:', error.message);
    process.exit(1);
  }
}

// Get applied migrations
async function getAppliedMigrations() {
  const { data, error } = await supabase
    .from('_migrations')
    .select('name');
  
  if (error) {
    console.error('Error fetching applied migrations:', error.message);
    process.exit(1);
  }
  
  return data?.map(row => row.name) || [];
}

// Apply a migration
async function applyMigration(migrationName, migrationSql) {
  console.log(`Applying migration: ${migrationName}`);
  
  // Execute the migration SQL
  const { error: sqlError } = await supabase.rpc('execute_sql', {
    sql_query: migrationSql
  });
  
  if (sqlError) {
    console.error(`Error applying migration ${migrationName}:`, sqlError.message);
    return false;
  }
  
  // Record the migration
  const { error: recordError } = await supabase
    .from('_migrations')
    .insert({ name: migrationName });
  
  if (recordError) {
    console.error(`Error recording migration ${migrationName}:`, recordError.message);
    return false;
  }
  
  console.log(`Migration applied successfully: ${migrationName}`);
  return true;
}

// Main function
async function runMigrations() {
  try {
    await ensureMigrationTable();
    const appliedMigrations = await getAppliedMigrations();
    
    // Get migration files
    const migrationsDir = path.join(process.cwd(), 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Natural sort order
    
    let appliedCount = 0;
    
    // Apply each migration that hasn't been applied yet
    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        const success = await applyMigration(file, sql);
        if (success) {
          appliedCount++;
        } else {
          console.error(`Failed to apply migration: ${file}`);
          process.exit(1);
        }
      } else {
        console.log(`Migration already applied: ${file}`);
      }
    }
    
    console.log(`Migrations complete. Applied ${appliedCount} new migration(s).`);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

// Run the migrations
runMigrations();
