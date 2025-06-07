/**
 * Node modules
 */

import express from 'express';

/**
 * Local modules
 */
import { APP_CONFIG } from '@/config';
import {
  compressionMiddleware,
  cookieParserMiddleware,
  corsMiddleware,
  helmetMiddleware,
  jsonMiddleware,
  rateLimiterMiddleware,
  urlMiddleware,
} from '@/middleware';

/**
 * Express server setup
 * Express application instance that serves as the main entry point for the blog API server.
 * This app instance is used to configure middleware, routes, and handle HTTP requests.
 *
 * @remarks
 * The app is created using the Express framework and will be configured with
 * various middleware, route handlers, and error handling before being started
 * on a specific port.
 */
const app = express();
app.use(corsMiddleware);
app.use(jsonMiddleware);
app.use(urlMiddleware);
app.use(helmetMiddleware);
app.use(cookieParserMiddleware);
app.use(compressionMiddleware);
app.use(rateLimiterMiddleware);

const requestHandler: express.RequestHandler = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  res.send('Hello World!');
};

app.get('/', requestHandler);

app.listen(APP_CONFIG.PORT, () => {
  console.log(`Server is running on http://localhost:${APP_CONFIG.PORT}`);
});
