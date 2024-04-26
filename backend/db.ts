import { Pool } from 'pg';

const pool = new Pool({
  user: 'alanfried',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

export default pool;
