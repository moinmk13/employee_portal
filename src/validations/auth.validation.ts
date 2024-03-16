import Joi, { ObjectSchema } from 'joi';
import { password } from './custom.validation';

class AuthValidation {
  public static register: ObjectSchema = Joi.object({
    body: Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      name: Joi.string().required(),
      role: Joi.string().required(),
    }),
  });

  public static login: ObjectSchema = Joi.object({
    body: Joi.object({
      email: Joi.string().required(),
    }),
  });

  public static logout: ObjectSchema = Joi.object({
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  });

  public static refreshTokens: ObjectSchema = Joi.object({
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  });

  public static forgotPassword: ObjectSchema = Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  });

  public static resetPassword: ObjectSchema = Joi.object({
    query: Joi.object({
      token: Joi.string().required(),
    }),
    body: Joi.object({
      password: Joi.string().required().custom(password),
    }),
  });

  public static verifyEmail: ObjectSchema = Joi.object({
    query: Joi.object({
      token: Joi.string().required(),
    }),
  });
  
}

export default AuthValidation;
