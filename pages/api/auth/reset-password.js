import { findUserByEmail } from '../../../models/user';
import { sendResetPasswordEmail } from '../../../utils/email';
import crypto from 'crypto';

const tokens = {}; // Store tokens temporarily (consider using a database in production)

export default async function handler(req, res) {
  const { email } = req.body;

  const user = await findUserByEmail(email);
  if (user.rows.length === 0) return res.status(404).json({ message: 'User not found.' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  tokens[email] = resetToken; // Save the reset token

  await sendResetPasswordEmail(email, resetToken);
  return res.status(200).json({ message: 'Reset password email sent.' });
}
