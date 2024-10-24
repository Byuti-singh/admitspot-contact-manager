const { Pool } = require('pg');
const pool = require('../utils/db');

// Contact Model
async function addContact(contactData) {
  const { name, email, phone, address, timezone, userId } = contactData;
  return pool.query(
    `INSERT INTO contacts (name, email, phone, address, timezone, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, email, phone, address, timezone, userId]
  );
}

async function getContacts(userId, filters, sort) {
  let query = 'SELECT * FROM contacts WHERE user_id = $1';
  if (filters.name) query += ` AND name ILIKE '%${filters.name}%'`;
  if (filters.email) query += ` AND email ILIKE '%${filters.email}%'`;
  query += ` ORDER BY ${sort || 'created_at DESC'}`;

  return pool.query(query, [userId]);
}

module.exports = { addContact, getContacts };
