import { RequestHandler, Router } from 'express';

export const v1Router = Router();
const requestHandler: RequestHandler = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  res.status(200).json({
    message: 'Api v1 is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'ok',
    docs: 'https://github.com/ccweerasinghe1994/blog-api',
  });
};
v1Router.get('/', requestHandler);
