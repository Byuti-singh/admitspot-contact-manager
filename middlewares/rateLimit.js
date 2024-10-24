import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
});
