import { UserModel } from '@/models/user.model';
import bcrypt from 'bcrypt';
import { body } from 'express-validator';
const emailValidationForRegistration = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isLength({ min: 5 })
  .withMessage('Email must be at least 5 characters long')
  .isEmail()
  .withMessage('Email must be a valid email address')
  .custom(async (email: string) => {
    const isEmailExists = await UserModel.exists({ email });
    if (isEmailExists) {
      throw new Error('Email already exists');
    }
    return true;
  });

const emailValidationForLogin = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isLength({ min: 5 })
  .withMessage('Email must be at least 5 characters long')
  .isEmail()
  .withMessage('Email must be a valid email address')
  .custom(async (email: string) => {
    const isEmailExists = await UserModel.exists({ email });
    if (!isEmailExists) {
      throw new Error('Email or password is incorrect');
    }
    return true;
  });

const passwordValidation = body('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .custom(async (password: string, { req }) => {
    const user = await UserModel.findOne({ email: req.body.email })
      .select('password')
      .lean()
      .exec();
    if (!user) {
      throw new Error('Email or password is incorrect');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Email or password is incorrect');
    }
  });

const roleValidation = body('role')
  .optional()
  .isString()
  .withMessage('Role must be a string')
  .isIn(['user', 'admin'])
  .withMessage('Role must be either "user" or "admin"');

export {
  emailValidationForLogin,
  emailValidationForRegistration,
  passwordValidation,
  roleValidation,
};
