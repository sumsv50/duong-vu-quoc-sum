import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function migrate() {
  try {
    console.log('Running database migrations...');

    const migrationSql = fs.readFileSync(
      path.join(__dirname, '../../migrations/1741358903_create_resources_table.sql'),
      'utf-8'
    );

    await pool.query(migrationSql);

    console.log('Migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();