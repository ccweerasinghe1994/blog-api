/**
 * JSON Body Parser Middleware Configuration
 *
 * This middleware parses incoming JSON request bodies and makes the parsed data
 * available on req.body. Essential for handling POST, PUT, and PATCH requests
 * that contain JSON data.
 *
 * @overview
 * JSON parsing is required for:
 * - API endpoints that accept JSON data
 * - Form submissions in JSON format
 * - AJAX requests from web applications
 * - Mobile app API communication
 * - Third-party service integrations
 *
 * @functionality
 * - Parses JSON request bodies automatically
 * - Populates req.body with parsed JavaScript objects
 * - Validates JSON syntax and structure
 * - Handles malformed JSON with appropriate errors
 * - Supports configurable size limits for security
 * - Provides detailed error messages for debugging
 *
 * @configuration
 * Current settings:
 * - Default Express JSON parser configuration
 * - Standard size limits (100kb by default)
 * - Automatic Content-Type header validation
 * - Built-in error handling for malformed JSON
 *
 * @example
 * Usage in Express application:
 * ```typescript
 * import express from 'express';
 * import { jsonMiddleware } from './middleware/jsonMiddleware';
 *
 * const app = express();
 *
 * // Apply JSON parsing middleware
 * app.use(jsonMiddleware);
 *
 * // Example POST route that uses parsed JSON
 * app.post('/api/posts', (req, res) => {
 *   // req.body now contains parsed JSON data
 *   const { title, content, author, tags } = req.body;
 *
 *   // Validate required fields
 *   if (!title || !content) {
 *     return res.status(400).json({
 *       error: 'Title and content are required'
 *     });
 *   }
 *
 *   // Create new blog post
 *   const newPost = {
 *     id: Date.now(),
 *     title,
 *     content,
 *     author: author || 'Anonymous',
 *     tags: tags || [],
 *     createdAt: new Date().toISOString()
 *   };
 *
 *   res.status(201).json(newPost);
 * });
 * ```
 *
 * @example
 * Request that will be parsed:
 * ```
 * POST /api/posts
 * Content-Type: application/json
 *
 * {
 *   "title": "My First Blog Post",
 *   "content": "This is the content of my blog post...",
 *   "author": "John Doe",
 *   "tags": ["javascript", "nodejs", "express"]
 * }
 * ```
 *
 * Available in route handler as:
 * ```typescript
 * req.body = {
 *   title: "My First Blog Post",
 *   content: "This is the content of my blog post...",
 *   author: "John Doe",
 *   tags: ["javascript", "nodejs", "express"]
 * }
 * ```
 *
 * @example
 * PUT request for updating a blog post:
 * ```typescript
 * app.put('/api/posts/:id', (req, res) => {
 *   const postId = req.params.id;
 *   const updates = req.body; // Parsed JSON updates
 *
 *   // Example update object
 *   // {
 *   //   "title": "Updated Blog Post Title",
 *   //   "content": "Updated content...",
 *   //   "tags": ["updated", "express", "api"]
 *   // }
 *
 *   res.json({
 *     id: postId,
 *     ...updates,
 *     updatedAt: new Date().toISOString()
 *   });
 * });
 * ```
 *
 * @error_handling
 * Common JSON parsing errors handled:
 *
 * 1. **Malformed JSON**
 *    ```
 *    Request: { "title": "Missing closing quote }
 *    Response: 400 Bad Request - "Unexpected end of JSON input"
 *    ```
 *
 * 2. **Invalid Content-Type**
 *    ```
 *    Request with Content-Type: text/plain
 *    Response: req.body will be undefined
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
 * - JSON parsing prevents code injection (unlike eval)
 * - Validates Content-Type header to prevent confusion
 * - Built-in protection against prototype pollution
 *
 * @best_practices
 * - Always validate parsed JSON data before use
 * - Set appropriate size limits for your use case
 * - Implement proper error handling for malformed JSON
 * - Use TypeScript interfaces to define expected JSON structure
 * - Consider request validation middleware for complex APIs
 *
 * @content_types
 * Supported Content-Type headers:
 * - `application/json` - Standard JSON requests
 * - `application/json; charset=utf-8` - JSON with charset
 * - `application/*+json` - JSON variants (e.g., application/vnd.api+json)
 *
 * @performance
 * Performance characteristics:
 * - Minimal overhead for small JSON payloads
 * - Efficient streaming parser for larger payloads
 * - Memory usage scales with payload size
 * - No performance impact on non-JSON requests
 *
 * @see {@link https://expressjs.com/en/4x/api.html#express.json} - Express JSON middleware
 * @see {@link https://www.npmjs.com/package/body-parser} - Body Parser documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse} - JSON.parse() reference
 */
import { json } from 'express';

/**
 * JSON body parser middleware instance for the blog API
 *
 * @config Default Express JSON parser settings
 * @default 100kb size limit, strict Content-Type validation
 *
 * @remarks
 * The default configuration is suitable for most API use cases.
 * For APIs handling large JSON payloads, consider increasing the limit:
 *
 * @example
 * Custom configuration for larger payloads:
 * ```typescript
 * export const jsonMiddleware = json({
 *   limit: '10mb',        // Increase size limit
 *   strict: true,         // Only parse arrays and objects
 *   type: 'application/json' // Strict content type checking
 * });
 * ```
 */
export const jsonMiddleware = json();
