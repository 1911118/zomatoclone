const pool = require('../config/db');

const createUser = async (name, email, password, phone, address, role = 'user') => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, email, password, phone, address, role]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

module.exports = { createUser, findUserByEmail };