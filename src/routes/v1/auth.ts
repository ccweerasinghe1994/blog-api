import { registerUser } from '@/controllers/v1/auth/auth.controller';
import { Router } from 'express';

const AuthRouter = Router();

AuthRouter.post('/login', (req, res) => {
  // Handle login
});

AuthRouter.post('/register', registerUser);

export { AuthRouter };
