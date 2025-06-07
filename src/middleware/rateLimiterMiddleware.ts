/**
 * Rate Limiting Middleware Configuration
 *
 * This middleware implements rate limiting to protect the API from abuse,
 * spam, and DDoS attacks by limiting the number of requests from a single
 * IP address within a specified time window.
 *
 * @overview
 * Rate limiting is essential for:
 * - Preventing API abuse and spam
 * - Protecting against DDoS attacks
 * - Ensuring fair resource usage among users
 * - Preventing brute force attacks
 * - Maintaining server performance and stability
 * - Reducing infrastructure costs
 *
 * @functionality
 * - Tracks requests per IP address
 * - Enforces configurable request limits per time window
 * - Returns standardized HTTP 429 (Too Many Requests) responses
 * - Provides rate limit information in response headers
 * - Automatically resets counters after time window expires
 * - Memory-based storage (suitable for single-instance deployments)
 *
 * @configuration
 * Current settings:
 * - Window: 60,000ms (1 minute)
 * - Limit: Configurable via APP_CONFIG.RATE_LIMIT_MAX
 * - Standard headers enabled (X-RateLimit-*)
 * - Legacy headers disabled (for cleaner responses)
 * - Custom error message for rate limit exceeded
 *
 * @example
 * Usage in Express application:
 * ```typescript
 * import express from 'express';
 * import { rateLimiterMiddleware } from './middleware/rateLimiterMiddleware';
 *
 * const app = express();
 *
 * // Apply rate limiting to all routes
 * app.use(rateLimiterMiddleware);
 *
 * // Example API route protected by rate limiting
 * app.get('/api/posts', (req, res) => {
 *   res.json({
 *     posts: [
 *       { id: 1, title: 'Blog Post 1' },
 *       { id: 2, title: 'Blog Post 2' }
 *     ]
 *   });
 * });
 *
 * // Example: Different rate limits for different endpoints
 * const strictLimiter = rateLimit({
 *   windowMs: 60 * 1000,     // 1 minute
 *   limit: 5,                // 5 requests per minute
 *   message: { error: 'Too many login attempts' }
 * });
 *
 * app.post('/api/auth/login', strictLimiter, (req, res) => {
 *   // Login logic with stricter rate limiting
 * });
 * ```
 *
 * @example
 * Response headers when rate limiting is active:
 * ```
 * HTTP/1.1 200 OK
 * X-RateLimit-Limit: 100
 * X-RateLimit-Remaining: 95
 * X-RateLimit-Reset: 1640995200000
 * Content-Type: application/json
 * ```
 *
 * @example
 * Response when rate limit is exceeded:
 * ```
 * HTTP/1.1 429 Too Many Requests
 * X-RateLimit-Limit: 100
 * X-RateLimit-Remaining: 0
 * X-RateLimit-Reset: 1640995200000
 * Retry-After: 60
 * Content-Type: application/json
 *
 * {
 *   "error": "you have exceeded the request limit for this endpoint. Please try again later."
 * }
 * ```
 *
 * @example
 * Environment configuration:
 * ```
 * RATE_LIMIT_MAX=100    # 100 requests per minute
 * RATE_LIMIT_MAX=1000   # 1000 requests per minute (higher for production)
 * ```
 *
 * @rate_limiting_strategies
 * Different approaches for various endpoints:
 *
 * 1. **General API Access**
 *    ```typescript
 *    // Current configuration: 100 requests per minute
 *    windowMs: 60 * 1000, limit: 100
 *    ```
 *
 * 2. **Authentication Endpoints** (stricter)
 *    ```typescript
 *    windowMs: 60 * 1000, limit: 5  // 5 login attempts per minute
 *    ```
 *
 * 3. **Public Read Endpoints** (more lenient)
 *    ```typescript
 *    windowMs: 60 * 1000, limit: 500  // 500 reads per minute
 *    ```
 *
 * 4. **Write/Modification Endpoints** (moderate)
 *    ```typescript
 *    windowMs: 60 * 1000, limit: 30  // 30 writes per minute
 *    ```
 *
 * @security
 * Security benefits:
 * - **DDoS Protection**: Prevents overwhelming the server with requests
 * - **Brute Force Mitigation**: Limits password guessing attempts
 * - **API Abuse Prevention**: Stops automated scraping and spam
 * - **Resource Protection**: Ensures server resources remain available
 * - **Cost Control**: Prevents unexpected infrastructure costs from abuse
 *
 * @performance
 * Performance considerations:
 * - Minimal memory overhead per IP address
 * - Fast in-memory counter operations
 * - Automatic cleanup of expired entries
 * - No impact on response time for allowed requests
 * - Consider Redis storage for multi-instance deployments
 *
 * @client_handling
 * Client-side handling recommendations:
 * ```typescript
 * // Example client-side rate limit handling
 * async function makeApiRequest(url: string) {
 *   try {
 *     const response = await fetch(url);
 *
 *     if (response.status === 429) {
 *       const retryAfter = response.headers.get('Retry-After');
 *       console.log(`Rate limited. Retry after ${retryAfter} seconds`);
 *
 *       // Wait and retry
 *       await new Promise(resolve =>
 *         setTimeout(resolve, parseInt(retryAfter) * 1000)
 *       );
 *       return makeApiRequest(url);
 *     }
 *
 *     return response.json();
 *   } catch (error) {
 *     console.error('API request failed:', error);
 *   }
 * }
 * ```
 *
 * @production_considerations
 * For production deployments:
 * - Use Redis for shared rate limiting across multiple servers
 * - Implement different limits for authenticated vs anonymous users
 * - Consider implementing user-specific rate limiting
 * - Monitor rate limiting metrics and adjust limits based on usage
 * - Implement rate limiting bypass for trusted IPs or API keys
 *
 * @monitoring
 * Rate limiting metrics to monitor:
 * - Number of rate-limited requests per hour/day
 * - Top IP addresses hitting rate limits
 * - Average requests per user/IP
 * - Rate limit effectiveness (reduction in server load)
 *
 * @see {@link https://www.npmjs.com/package/express-rate-limit} - Express Rate Limit documentation
 * @see {@link https://tools.ietf.org/html/rfc6585#section-4} - HTTP 429 status code specification
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After} - Retry-After header
 */
import { APP_CONFIG } from '@/config';
import { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';

/**
 * API rate limiter configuration for general endpoint protection
 *
 * @config windowMs - Time window for rate limiting (1 minute)
 * @config limit - Maximum requests per window (from environment config)
 * @config standardHeaders - Include rate limit info in response headers
 * @config legacyHeaders - Disable legacy X-RateLimit-* headers
 * @config message - Custom error message for rate limit exceeded
 *
 * @remarks
 * This configuration provides balanced protection suitable for most API endpoints.
 * The limit is configurable via environment variables to allow different settings
 * for development, staging, and production environments.
 *
 * Rate limit headers included in responses:
 * - X-RateLimit-Limit: Maximum requests allowed in window
 * - X-RateLimit-Remaining: Requests remaining in current window
 * - X-RateLimit-Reset: Timestamp when the window resets
 * - Retry-After: Seconds to wait before retrying (when rate limited)
 */
export const apiLimiter: RequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute time window
  limit: APP_CONFIG.RATE_LIMIT_MAX, // Configurable request limit
  standardHeaders: true, // Include rate limit info in headers
  legacyHeaders: false, // Disable legacy headers for cleaner responses
  message: {
    error:
      'you have exceeded the request limit for this endpoint. Please try again later.',
  },
});

/**
 * Main rate limiter middleware export
 *
 * @alias apiLimiter
 * @usage Apply to routes that need rate limiting protection
 *
 * @example
 * Usage in route definitions:
 * ```typescript
 * app.use('/api', rateLimiterMiddleware);  // Apply to all API routes
 * app.get('/api/posts', rateLimiterMiddleware, handler);  // Apply to specific route
 * ```
 */
export const rateLimiterMiddleware = apiLimiter;
