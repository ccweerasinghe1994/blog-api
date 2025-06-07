/**
 * Compression Middleware Configuration
 *
 * This middleware automatically compresses HTTP responses using gzip compression
 * to reduce bandwidth usage and improve response times for clients.
 *
 * @overview
 * Compression is particularly beneficial for:
 * - Large JSON responses (API data, lists, nested objects)
 * - HTML content (if serving any static pages)
 * - CSS and JavaScript files
 * - Text-based responses over 1KB in size
 *
 * @performance
 * - Reduces response size by 60-80% for text-based content
 * - Improves load times for slow connections
 * - Reduces server bandwidth costs
 * - Minimal CPU overhead for compression
 *
 * @configuration
 * Current settings:
 * - `threshold: 1024` - Only compress responses larger than 1KB (1024 bytes)
 * - Uses default gzip compression level (6 - balanced speed/compression)
 * - Automatically detects compressible content types
 *
 * @example
 * Usage in Express application:
 * ```typescript
 * import express from 'express';
 * import { compressionMiddleware } from './middleware/compressionMiddleware';
 *
 * const app = express();
 *
 * // Apply compression middleware early in the middleware stack
 * app.use(compressionMiddleware);
 *
 * // Example route that benefits from compression
 * app.get('/api/posts', (req, res) => {
 *   const largeBlogPosts = {
 *     posts: Array(100).fill({
 *       id: 1,
 *       title: 'Example Blog Post',
 *       content: 'This is a long blog post content...',
 *       author: 'John Doe',
 *       tags: ['javascript', 'nodejs', 'express'],
 *       createdAt: new Date().toISOString()
 *     })
 *   };
 *
 *   // This response will be compressed (likely >1KB)
 *   res.json(largeBlogPosts);
 * });
 * ```
 *
 * @example
 * Response headers with compression enabled:
 * ```
 * HTTP/1.1 200 OK
 * Content-Type: application/json
 * Content-Encoding: gzip
 * Content-Length: 1234
 * Vary: Accept-Encoding
 * ```
 *
 * @example
 * Before compression (example blog post list):
 * ```
 * Response size: 15,420 bytes
 * Transfer time: 245ms (slow connection)
 * ```
 *
 * After compression:
 * ```
 * Response size: 3,128 bytes (80% reduction)
 * Transfer time: 95ms (60% faster)
 * ```
 *
 * @security
 * Compression is generally safe for APIs, but consider:
 * - BREACH attack mitigation: Avoid compressing responses containing both
 *   user input and sensitive data in the same response
 * - For blog APIs, this is typically not a concern
 *
 * @browser_support
 * All modern browsers support gzip compression:
 * - Chrome, Firefox, Safari, Edge: Full support
 * - Mobile browsers: Full support
 * - Legacy browsers (IE6+): Full support
 *
 * @see {@link https://www.npmjs.com/package/compression} - Compression middleware documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding} - Content-Encoding header
 */
import compression from 'compression';

/**
 * Compression middleware instance configured for the blog API
 *
 * @config threshold - Minimum response size (in bytes) to trigger compression
 * @default 1024 bytes (1KB) - Optimal balance between compression benefit and processing overhead
 *
 * @remarks
 * The 1KB threshold is chosen because:
 * - Responses smaller than 1KB have minimal compression benefit
 * - Compression overhead isn't worth it for small responses
 * - Network packet size considerations
 * - Follows Express.js best practices
 */
export const compressionMiddleware = compression({
  threshold: 1024,
});
