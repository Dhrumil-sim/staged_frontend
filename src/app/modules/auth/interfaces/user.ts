export type User = object;
import Joi from 'joi';

export const registerUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('artist', 'user').required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).optional(),
  username: Joi.string().optional(),
  password: Joi.string().min(6).required(),
}).xor('email', 'username'); // Require exactly one of email or username

export interface LoginResponse {
  message: string;
  data: {
    user: {
      _id: string;
      id: string;
      username: string;
      email: string;
      profile_picture: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}
