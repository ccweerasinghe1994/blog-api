import { registerUser } from '@/controllers/v1/auth/auth.controller';
import { loginHandler } from '@/controllers/v1/auth/login.controller';
import { logoutHandler } from '@/controllers/v1/auth/logout.controller';
import { refreshTokenHandler } from '@/controllers/v1/auth/token.controller';
import { expressValidationMiddleware } from '@/middleware/expressValidationMiddleware';
import {
  emailValidationForLogin,
  emailValidationForRegistration,
  passwordValidation,
  roleValidation,
} from '@/validation';
import { RequestHandler, Router } from 'express';
import { cookie } from 'express-validator';
const AuthRouter = Router();

const loginValidationMiddleware: RequestHandler[] = [
  emailValidationForLogin,
  passwordValidation,
];

AuthRouter.post(
  '/login',
  loginValidationMiddleware,
  expressValidationMiddleware,
  loginHandler,
);

const registrationValidationMiddleware: RequestHandler[] = [
  emailValidationForRegistration,
  passwordValidation,
  roleValidation,
];

AuthRouter.post(
  '/register',
  registrationValidationMiddleware,
  expressValidationMiddleware,
  registerUser,
);

AuthRouter.post(
  '/refresh-token',
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token format'),
  expressValidationMiddleware,
  refreshTokenHandler,
);

AuthRouter.post('/logout', logoutHandler);

export { AuthRouter };
