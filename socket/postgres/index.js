import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err, client) => {
	console.error('Error in database connection pool:', err);
});

export default pool;
