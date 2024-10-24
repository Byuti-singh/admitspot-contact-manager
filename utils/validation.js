// utils/validation.js
import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Validation function
export const validate = (schema, data) => {
  return schema.validate(data);
};
