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

async function updateContact(contactData) {
  const { name, email, phone, address, timezone, id } = contactData;
  let query = 'SELECT * FROM contacts WHERE user_id = $1 AND deleted_at IS NULL';
  if (name) query += ` AND name ILIKE '%${name}%'`;
  if (email) query += ` AND email ILIKE '%${email}%'`;
  query += ` ORDER BY ${'created_at DESC'}`;

  const existingContact = pool.query(query, [id]);
  if (existingContact.rowCount === 0) {
    return existingContact;
  }

  return pool.query(
    `UPDATE contacts 
     SET name = $1, email = $2, phone = $3, address = $4, timezone = $5, updated_at = NOW() 
     WHERE id = $6 RETURNING *`,
    [name, email, phone, address, timezone, id]
  );
}

async function deleteContact(contactData) {
  const { name, email, id } = contactData;
  let query = 'SELECT * FROM contacts WHERE user_id = $1 AND deleted_at IS NULL';
  if (name) query += ` AND name ILIKE '%${name}%'`;
  if (email) query += ` AND email ILIKE '%${email}%'`;
  query += ` ORDER BY ${'created_at DESC'}`;

  const existingContact = pool.query(query, [id]);
  if (existingContact.rowCount === 0) {
    return existingContact;
  }

  return await pool.query(
    `UPDATE contacts 
     SET deleted_at = NOW() 
     WHERE id = $1 AND deleted_at IS NULL 
     RETURNING *`,
    [id]
  );
}

module.exports = { addContact, getContacts, updateContact, deleteContact };

