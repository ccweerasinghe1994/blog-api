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
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import { v1Router } from './routes/v1';
import { Logger } from '@/lib/winston';

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

(async () => {
  try {
    await connectToDatabase();
    app.use('/api/v1', v1Router);

    app.listen(APP_CONFIG.PORT, () => {
      Logger.info(`Server is running on http://localhost:${APP_CONFIG.PORT}`);
    });
  } catch (error) {
    Logger.error('Error starting the server:', error);
    process.exit(1); // Exit the process with a failure code
  }
})();
const shutdown = async () => {
  try {
    await disconnectFromDatabase();
    Logger.info('Shutting down server gracefully...');
    // Perform any necessary cleanup here, such as closing database connections
    // or stopping background tasks.
    process.exit(0); // Exit the process with a success code
  } catch (error) {
    Logger.error('Error during shutdown:', error);
  }
};

process.on('SIGINT', shutdown); // Handle Ctrl+C
process.on('SIGTERM', shutdown); // Handle termination signal
