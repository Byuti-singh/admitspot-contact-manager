import { createUser, findUserByEmail } from '../../../models/user';
import { sendVerificationEmail } from '../../../utils/email';
import { userSchema } from '../../../schemas/userSchema';
import { validate } from '../../../utils/validation';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { name, email, password } = req.body;

  const { error } = validate(userSchema, { name, email, password });
  if (error) return res.status(400).json({ error: error.details });

  const existingUser = await findUserByEmail(email);
  if (existingUser.rows.length > 0) return res.status(409).json({ message: 'Email already in use.' });

  const user = await createUser({ name, email, password, verified: false });

  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  await sendVerificationEmail(email, token);

  return res.status(201).json({ message: 'User registered. Verify your email.' });
}
