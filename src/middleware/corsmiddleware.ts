import { APP_CONFIG } from '@/config';
import { Logger } from '@/lib/winston';
import cors, { CorsOptions } from 'cors';
/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 *
 * Configures CORS policy to control which origins are allowed to access the API.
 * This implements a security layer that prevents unauthorized cross-origin requests
 * while allowing legitimate clients to access the API endpoints.
 *
 * @security
 * - Development mode: Allows all origins for easier development
 * - Production mode: Only allows whitelisted origins from environment config
 * - Non-browser requests: Allows requests without origin header (e.g., mobile apps, Postman)
 *
 * @behavior
 * The origin validation function receives:
 * - `origin`: The origin of the requesting client (undefined for same-origin or non-browser requests)
 * - `callback`: Function to call with (error, allowed) parameters
 *
 * Allowed scenarios:
 * 1. Development environment (NODE_ENV === 'development')
 * 2. Requests without origin header (!origin) - typically server-to-server or mobile apps
 * 3. Origins explicitly listed in WHITELIST_ORIGINS environment variable
 *
 * Blocked scenarios:
 * - Production requests from origins not in the whitelist
 * - Malicious cross-origin requests from unauthorized domains
 *
 * @example Environment Configuration
 * ```
 * NODE_ENV=production
 * WHITELIST_ORIGINS=[https://myblog.com,https://admin.myblog.com]
 * ```
 */
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow all origins in development mode for easier testing
    if (APP_CONFIG.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }

    // Allow requests without origin header (server-to-server, mobile apps, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check if the origin is in the whitelist for production
    if (APP_CONFIG.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    // Reject unauthorized origins with detailed error logging
    const errorMessage = `CORS error: ${origin} is not allowed by CORS policy`;
    Logger.error(errorMessage);
    callback(new Error(errorMessage), false);
  },
};

export const corsMiddleware = cors(corsOptions);
