import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../../../models/user';
const pool = require('../../../utils/db');

export default async function handler(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByEmail(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token.' });

    await pool.query(`UPDATE users SET updated_at = NOW(), verified = true WHERE id = $1`, [decoded.id]);
    res.status(200).json({ message: 'Email verified.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
}
