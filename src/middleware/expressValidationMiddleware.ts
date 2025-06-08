import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

const expressValidationMiddleware: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.mapped() });
    return;
  }
  next();
};

export { expressValidationMiddleware };
