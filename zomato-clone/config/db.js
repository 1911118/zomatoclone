const { Pool } = require('pg');
require('dotenv').config();

// Log the environment variables (without sensitive data)
console.log('Database Configuration:');
console.log('Host:', process.env.DB_HOST);
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'zomato_clone',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  // Add connection timeout
  connectionTimeoutMillis: 5000,
  // Add error handling
  idleTimeoutMillis: 30000,
});

// Test the connection
pool.connect()
  .then(client => {
    console.log('Successfully connected to PostgreSQL database!');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    console.error('Please check your database credentials in .env file');
    process.exit(1);
  });

module.exports = pool;
