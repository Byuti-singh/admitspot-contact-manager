import { findUserByEmail } from '../../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (user.rows.length === 0) return res.status(404).json({ message: 'User not found.' });

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid credentials.' });

  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });

  return res.status(200).json({ token });
}
