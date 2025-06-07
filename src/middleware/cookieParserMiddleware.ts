/**
 * Cookie Parser Middleware Configuration
 *
 * This middleware parses Cookie headers and populates req.cookies with an object
 * keyed by cookie names. It also supports signed cookies for enhanced security.
 *
 * @overview
 * Cookie parsing is essential for:
 * - Session management and authentication
 * - User preferences and settings
 * - Shopping cart persistence
 * - CSRF protection tokens
 * - Analytics and tracking (with user consent)
 *
 * @functionality
 * - Parses incoming Cookie headers automatically
 * - Populates req.cookies object for easy access
 * - Supports signed cookies for security
 * - Handles cookie encoding/decoding
 * - Validates cookie format and structure
 *
 * @configuration
 * Current settings:
 * - No secret key (unsigned cookies only)
 * - Default options for parsing
 * - Automatic JSON parsing for cookie values
 *
 * @example
 * Usage in Express application:
 * ```typescript
 * import express from 'express';
 * import { cookieParserMiddleware } from './middleware/cookieParserMiddleware';
 *
 * const app = express();
 *
 * // Apply cookie parser middleware
 * app.use(cookieParserMiddleware);
 *
 * // Example route using cookies
 * app.get('/api/user/preferences', (req, res) => {
 *   // Access cookies from the request
 *   const theme = req.cookies.theme || 'light';
 *   const language = req.cookies.language || 'en';
 *
 *   res.json({
 *     preferences: {
 *       theme,
 *       language
 *     }
 *   });
 * });
 *
 * // Example route setting cookies
 * app.post('/api/user/preferences', (req, res) => {
 *   const { theme, language } = req.body;
 *
 *   // Set cookies with options
 *   res.cookie('theme', theme, {
 *     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
 *     httpOnly: true,
 *     secure: process.env.NODE_ENV === 'production',
 *     sameSite: 'strict'
 *   });
 *
 *   res.cookie('language', language, {
 *     maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
 *     httpOnly: true
 *   });
 *
 *   res.json({ message: 'Preferences saved' });
 * });
 * ```
 *
 * @example
 * Accessing parsed cookies in routes:
 * ```typescript
 * app.get('/api/auth/check', (req, res) => {
 *   // Cookies are automatically parsed and available
 *   const sessionId = req.cookies.sessionId;
 *   const rememberMe = req.cookies.rememberMe === 'true';
 *
 *   if (!sessionId) {
 *     return res.status(401).json({ error: 'No session found' });
 *   }
 *
 *   // Validate session and respond
 *   res.json({
 *     authenticated: true,
 *     sessionId,
 *     rememberMe
 *   });
 * });
 * ```
 *
 * @example
 * Cookie headers that will be parsed:
 * ```
 * Cookie: theme=dark; language=en; sessionId=abc123; rememberMe=true
 * ```
 *
 * Becomes accessible as:
 * ```typescript
 * req.cookies = {
 *   theme: 'dark',
 *   language: 'en',
 *   sessionId: 'abc123',
 *   rememberMe: 'true'
 * }
 * ```
 *
 * @security
 * Security considerations for cookie handling:
 * - Use `httpOnly: true` to prevent XSS attacks
 * - Set `secure: true` in production (HTTPS only)
 * - Use `sameSite: 'strict'` to prevent CSRF attacks
 * - Consider signed cookies for sensitive data
 * - Implement proper cookie expiration
 *
 * @best_practices
 * - Keep cookie values small (browsers limit total cookie size)
 * - Use meaningful cookie names
 * - Set appropriate expiration times
 * - Consider using secure, signed cookies for sensitive data
 * - Always validate cookie values before using them
 *
 * @browser_support
 * Cookie support is universal:
 * - All modern browsers: Full support
 * - Mobile browsers: Full support
 * - Legacy browsers: Full support
 * - Server-to-server requests: Configurable support
 *
 * @see {@link https://www.npmjs.com/package/cookie-parser} - Cookie Parser documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie} - Cookie header specification
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie} - Set-Cookie header specification
 */
import cookieParser from 'cookie-parser';

/**
 * Cookie parser middleware instance for the blog API
 *
 * @config No secret key provided - uses unsigned cookies only
 * @default Standard cookie parsing with automatic JSON value parsing
 *
 * @remarks
 * This configuration provides basic cookie parsing functionality.
 * For production applications handling sensitive data, consider:
 * - Adding a secret key for signed cookies: cookieParser('your-secret-key')
 * - Implementing additional cookie validation
 * - Using secure cookie options in production
 *
 * @example
 * To enable signed cookies (recommended for production):
 * ```typescript
 * export const cookieParserMiddleware = cookieParser(process.env.COOKIE_SECRET);
 * ```
 */
export const cookieParserMiddleware = cookieParser();
