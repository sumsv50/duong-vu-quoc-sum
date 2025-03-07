import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Get PostgreSQL connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString,
});

export default pool;