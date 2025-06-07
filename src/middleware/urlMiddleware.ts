/**
 * URL-Encoded Body Parser Middleware Configuration
 *
 * This middleware parses incoming URL-encoded request bodies (typically from
 * HTML forms) and makes the parsed data available on req.body.
 *
 * @overview
 * URL-encoded parsing is required for:
 * - HTML form submissions (application/x-www-form-urlencoded)
 * - Traditional web form data
 * - POST requests from older web applications
 * - API endpoints that accept form-encoded data
 * - File upload forms (multipart/form-data handling requires additional middleware)
 *
 * @functionality
 * - Parses URL-encoded request bodies automatically
 * - Populates req.body with parsed form data
 * - Supports nested objects with extended parsing
 * - Handles arrays and complex form structures
 * - Validates Content-Type header for proper parsing
 * - Provides configurable size limits for security
 *
 * @configuration
 * Current settings:
 * - `extended: true` - Uses qs library for rich object parsing
 * - Default size limits (100kb by default)
 * - Automatic Content-Type header validation
 * - Support for nested objects and arrays
 *
 * @example
 * Usage in Express application:
 * ```typescript
 * import express from 'express';
 * import { urlMiddleware } from './middleware/urlMiddleware';
 *
 * const app = express();
 *
 * // Apply URL-encoded parsing middleware
 * app.use(urlMiddleware);
 *
 * // Example route handling form submission
 * app.post('/api/contact', (req, res) => {
 *   // req.body now contains parsed form data
 *   const { name, email, message, subscribe } = req.body;
 *
 *   // Validate required fields
 *   if (!name || !email || !message) {
 *     return res.status(400).json({
 *       error: 'Name, email, and message are required'
 *     });
 *   }
 *
 *   // Process contact form
 *   const contactRequest = {
 *     id: Date.now(),
 *     name,
 *     email,
 *     message,
 *     subscribe: subscribe === 'on', // Convert checkbox value
 *     submittedAt: new Date().toISOString()
 *   };
 *
 *   res.json({ message: 'Contact form submitted successfully' });
 * });
 * ```
 *
 * @example
 * HTML form that will be parsed:
 * ```html
 * <form method="POST" action="/api/blog/create">
 *   <input type="text" name="title" value="My Blog Post" />
 *   <textarea name="content">This is my blog content...</textarea>
 *   <input type="text" name="author" value="John Doe" />
 *   <input type="checkbox" name="published" checked />
 *   <input type="text" name="tags[]" value="javascript" />
 *   <input type="text" name="tags[]" value="nodejs" />
 *   <button type="submit">Create Post</button>
 * </form>
 * ```
 *
 * Available in route handler as:
 * ```typescript
 * req.body = {
 *   title: "My Blog Post",
 *   content: "This is my blog content...",
 *   author: "John Doe",
 *   published: "on",
 *   tags: ["javascript", "nodejs"]
 * }
 * ```
 *
 * @example
 * URL-encoded request body (what gets sent):
 * ```
 * POST /api/blog/create
 * Content-Type: application/x-www-form-urlencoded
 *
 * title=My%20Blog%20Post&content=This%20is%20my%20blog%20content...&author=John%20Doe&published=on&tags%5B%5D=javascript&tags%5B%5D=nodejs
 * ```
 *
 * @example
 * Complex nested object parsing with extended=true:
 * ```typescript
 * // Form data: user[name]=John&user[email]=john@example.com&user[preferences][theme]=dark
 * req.body = {
 *   user: {
 *     name: "John",
 *     email: "john@example.com",
 *     preferences: {
 *       theme: "dark"
 *     }
 *   }
 * }
 * ```
 *
 * @extended_vs_simple
 * Configuration options:
 *
 * **Extended: true (current setting)**
 * - Uses `qs` library for parsing
 * - Supports nested objects and arrays
 * - Rich object notation parsing
 * - Better for complex forms
 *
 * **Extended: false (alternative)**
 * - Uses `querystring` library
 * - Simple key-value parsing only
 * - No nested object support
 * - Better performance for simple forms
 *
 * @content_types
 * Supported Content-Type headers:
 * - `application/x-www-form-urlencoded` - Standard form encoding
 * - `application/x-www-form-urlencoded; charset=utf-8` - With charset
 *
 * @error_handling
 * Common parsing scenarios:
 *
 * 1. **Valid form data**
 *    ```
 *    Request: name=John&email=john@example.com
 *    Result: { name: "John", email: "john@example.com" }
 *    ```
 *
 * 2. **Invalid Content-Type**
 *    ```
 *    Request with Content-Type: application/json
 *    Result: req.body will be undefined (not processed by this middleware)
 *    ```
 *
 * 3. **Payload too large**
 *    ```
 *    Request > 100kb (default limit)
 *    Response: 413 Payload Too Large
 *    ```
 *
 * @security
 * Security considerations:
 * - Size limits prevent DoS attacks via large payloads
 * - URL decoding prevents some injection attacks
 * - No code execution (unlike eval-based parsing)
 * - Validates Content-Type header to prevent confusion
 *
 * @best_practices
 * - Always validate and sanitize parsed form data
 * - Set appropriate size limits for your use case
 * - Use CSRF protection for form submissions
 * - Consider rate limiting for form endpoints
 * - Implement proper input validation
 * - Use HTTPS for sensitive form data
 *
 * @api_usage
 * While primarily for forms, can be useful for APIs that accept form data:
 * ```typescript
 * // API endpoint accepting both JSON and form data
 * app.post('/api/posts', jsonMiddleware, urlMiddleware, (req, res) => {
 *   // req.body will contain data regardless of Content-Type
 *   const { title, content } = req.body;
 *   // Process data...
 * });
 * ```
 *
 * @performance
 * Performance characteristics:
 * - Fast parsing for simple key-value pairs
 * - Slightly slower with extended=true for complex objects
 * - Memory usage scales with payload size
 * - No performance impact on non-form requests
 *
 * @see {@link https://expressjs.com/en/4x/api.html#express.urlencoded} - Express URL-encoded middleware
 * @see {@link https://www.npmjs.com/package/qs} - qs library (used with extended=true)
 * @see {@link https://nodejs.org/api/querystring.html} - Node.js querystring (used with extended=false)
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST} - HTTP POST method
 */
import { urlencoded } from 'express';

/**
 * URL-encoded body parser middleware instance for the blog API
 *
 * @config extended - Use qs library for rich object parsing (true)
 * @default Extended parsing enabled for complex form handling
 *
 * @remarks
 * The extended=true configuration allows parsing of rich objects and arrays,
 * making it suitable for complex forms and nested data structures.
 * This is the recommended setting for most applications.
 *
 * @example
 * Alternative configurations:
 * ```typescript
 * // Simple parsing (better performance, limited features)
 * export const urlMiddleware = urlencoded({ extended: false });
 *
 * // Custom size limit
 * export const urlMiddleware = urlencoded({
 *   extended: true,
 *   limit: '10mb'
 * });
 *
 * // Parameter limit (prevent DoS via too many parameters)
 * export const urlMiddleware = urlencoded({
 *   extended: true,
 *   parameterLimit: 20
 * });
 * ```
 */
export const urlMiddleware = urlencoded({ extended: true });
