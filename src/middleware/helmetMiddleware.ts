/**
 * Helmet Security Middleware Configuration
 *
 * Helmet helps secure Express apps by setting various HTTP headers to protect
 * against common web vulnerabilities and attacks.
 *
 * @overview
 * Helmet provides protection against:
 * - Cross-Site Scripting (XSS) attacks
 * - Content Type sniffing attacks
 * - Clickjacking attacks
 * - MIME type confusion attacks
 * - DNS prefetch control
 * - Frameguard protection
 * - HSTS (HTTP Strict Transport Security)
 * - Content Security Policy violations
 *
 * @security_headers
 * Helmet automatically sets these security headers:
 * - `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
 * - `X-Frame-Options: DENY` - Prevents clickjacking
 * - `X-XSS-Protection: 1; mode=block` - XSS protection (legacy browsers)
 * - `Strict-Transport-Security` - HTTPS enforcement (if configured)
 * - `Content-Security-Policy` - Controls resource loading (if configured)
 * - `X-DNS-Prefetch-Control: off` - Controls DNS prefetching
 * - `X-Download-Options: noopen` - Prevents file downloads from opening automatically
 * - `X-Permitted-Cross-Domain-Policies: none` - Controls cross-domain policies
 *
 * @configuration
 * Current settings:
 * - Default Helmet configuration (recommended for most applications)
 * - All security headers enabled
 * - No custom CSP (Content Security Policy) configured
 *
 * @example
 * Usage in Express application:
 * ```typescript
 * import express from 'express';
 * import { helmetMiddleware } from './middleware/helmetMiddleware';
 *
 * const app = express();
 *
 * // Apply Helmet security middleware early in the stack
 * app.use(helmetMiddleware);
 *
 * // Example API route now protected by security headers
 * app.get('/api/posts', (req, res) => {
 *   res.json({
 *     posts: [
 *       { id: 1, title: 'Secure Blog Post', content: '...' }
 *     ]
 *   });
 * });
 * ```
 *
 * @example
 * Response headers added by Helmet:
 * ```
 * HTTP/1.1 200 OK
 * X-Content-Type-Options: nosniff
 * X-Frame-Options: DENY
 * X-XSS-Protection: 1; mode=block
 * X-DNS-Prefetch-Control: off
 * X-Download-Options: noopen
 * X-Permitted-Cross-Domain-Policies: none
 * Content-Type: application/json
 * ```
 *
 * @example
 * Custom Helmet configuration (for advanced use cases):
 * ```typescript
 * import helmet from 'helmet';
 *
 * export const helmetMiddleware = helmet({
 *   // Custom Content Security Policy
 *   contentSecurityPolicy: {
 *     directives: {
 *       defaultSrc: ["'self'"],
 *       styleSrc: ["'self'", "'unsafe-inline'"],
 *       scriptSrc: ["'self'"],
 *       imgSrc: ["'self'", "data:", "https:"],
 *     },
 *   },
 *
 *   // HSTS configuration for HTTPS enforcement
 *   hsts: {
 *     maxAge: 31536000, // 1 year
 *     includeSubDomains: true,
 *     preload: true
 *   },
 *
 *   // Referrer Policy
 *   referrerPolicy: { policy: "same-origin" }
 * });
 * ```
 *
 * @vulnerabilities_protected
 * Specific attacks prevented:
 *
 * 1. **XSS (Cross-Site Scripting)**
 *    - X-XSS-Protection header enables browser XSS filtering
 *    - CSP can block inline scripts and unauthorized resources
 *
 * 2. **Clickjacking**
 *    - X-Frame-Options prevents embedding in iframes
 *    - Protects against UI redress attacks
 *
 * 3. **MIME Sniffing**
 *    - X-Content-Type-Options prevents content type confusion
 *    - Stops browsers from executing files as unexpected types
 *
 * 4. **DNS Prefetch Attacks**
 *    - Controls DNS prefetching to prevent information leakage
 *
 * @performance
 * Helmet impact:
 * - Minimal performance overhead (header addition only)
 * - No impact on response body or processing time
 * - Headers are cached by browsers for subsequent requests
 * - CSP may require additional parsing (if configured)
 *
 * @api_compatibility
 * Helmet is API-friendly:
 * - Compatible with REST APIs and JSON responses
 * - Works with CORS for cross-origin API access
 * - No interference with API functionality
 * - Headers improve API security without breaking functionality
 *
 * @production_ready
 * Production considerations:
 * - Default configuration is production-ready
 * - Consider custom CSP for stricter security
 * - Enable HSTS for HTTPS-only APIs
 * - Monitor for any header conflicts with CDNs/proxies
 *
 * @see {@link https://www.npmjs.com/package/helmet} - Helmet documentation
 * @see {@link https://helmetjs.github.io/} - Helmet official website
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Security} - Web Security best practices
 * @see {@link https://owasp.org/www-project-secure-headers/} - OWASP Secure Headers
 */
import helmet from 'helmet';

/**
 * Helmet security middleware instance for the blog API
 *
 * @config Default configuration with all security headers enabled
 * @default Recommended settings for most web applications and APIs
 *
 * @remarks
 * The default configuration provides strong security for most use cases.
 * For APIs serving content to web applications, this provides essential
 * protection without interfering with API functionality.
 *
 * Consider customizing for specific needs:
 * - Add CSP directives if serving web content
 * - Configure HSTS for HTTPS-only APIs
 * - Adjust frame options if API responses are embedded
 */
export const helmetMiddleware = helmet();
