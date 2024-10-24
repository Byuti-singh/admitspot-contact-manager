const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = require('../utils/db');

// User Model
async function createUser({ name, email, password, verified }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return pool.query(
    `INSERT INTO users (name, email, password, verified) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, hashedPassword, verified]
  );
}

async function findUserByEmail(email) {
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
}

module.exports = { createUser, findUserByEmail };
