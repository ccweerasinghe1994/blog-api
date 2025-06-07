/**
 * Node modules
 */
import express from 'express';

/**
 * Local modules
 */
import config from '@/config';

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

const requestHandler: express.RequestHandler = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  res.send('Hello World!');
};

app.get('/', requestHandler);

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
