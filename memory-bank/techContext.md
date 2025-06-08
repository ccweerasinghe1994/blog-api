# Technical Context: Blog API

## Technology Stack

### Core Technologies
- **Runtime**: Node.js
- **Language**: TypeScript (^5.8.3)
- **Framework**: Express.js (^5.1.0) for HTTP server
- **Database**: MongoDB with Mongoose ODM (^8.15.1)
- **Authentication**: JWT tokens with jsonwebtoken (^9.0.2)
- **Password Security**: bcrypt (^6.0.0) for password hashing
- **Validation**: express-validator (^7.2.1) for request validation
- **Logging**: Winston (^3.17.0) for professional logging
- **Utility**: ms (^2.1.3) for time parsing
- **Module System**: CommonJS (`"type": "commonjs"`)
- **Entry Point**: dist/server.js (compiled from TypeScript)
- **Build Target**: ES2016 for modern Node.js compatibility
- **Environment Management**: dotenv (^16.5.0) for configuration

### Development Tools
- **Code Formatting**: Prettier (^3.5.3)
- **Code Quality**: .prettierignore for selective formatting
- **Type System**: TypeScript compiler (tsc)
- **Package Manager**: npm
- **Development Server**: Nodemon (^3.1.10) for hot reloading
- **TypeScript Runtime**: ts-node (^10.9.2) for development
- **Path Resolution**: tsconfig-paths (^4.2.0) for import mapping
- **Type Definitions**: @types/express, @types/node, @types/bcrypt, @types/jsonwebtoken for TypeScript support

### Project Configuration
- **Package.json**: Standard Node.js project structure
- **TypeScript Config**: tsconfig.json with strict compilation settings
- **Version**: 1.0.0
- **License**: ISC

## Development Environment

### Platform
- **OS**: Windows
- **Shell**: PowerShell (pwsh.exe)
- **IDE**: VS Code (inferred from workspace structure)

### File Structure
```
blog-api/
├── .vscode/                 # VS Code workspace configuration
│   └── launch.json          # Debug configuration for compiled output
├── dist/                    # Compiled TypeScript output (git ignored)
├── src/                     # TypeScript source code
│   ├── config/              # Environment configuration
│   │   └── index.ts         # Configuration module with JWT, auth, logging
│   ├── controllers/         # Request/response handling (✅ Auth started)
│   │   └── v1/
│   │       └── auth/
│   │           └── auth.controller.ts  # User registration controller
│   ├── lib/                 # Shared libraries and utilities (✅ Enhanced)
│   │   ├── jwt.ts           # JWT token generation and validation
│   │   ├── mongoose.ts      # Database connection management
│   │   └── winston.ts       # Professional logging configuration
│   ├── middleware/          # Cross-cutting concerns (✅ Complete)
│   │   ├── compressionMiddleware.ts    # Response compression
│   │   ├── cookieParserMiddleware.ts   # Cookie parsing
│   │   ├── corsMiddleware.ts           # Cross-origin requests
│   │   ├── helmetMiddleware.ts         # Security headers
│   │   ├── jsonMiddleware.ts           # JSON body parsing
│   │   ├── rateLimiterMiddleware.ts    # Rate limiting
│   │   ├── urlMiddleware.ts            # URL encoding
│   │   └── index.ts                    # Middleware exports
│   ├── models/              # Data models (✅ User/Token implemented)
│   │   ├── user.model.ts    # User schema with validation and auth
│   │   └── token.model.ts   # Refresh token storage model
│   ├── routes/              # API routing structure (✅ Auth routes added)
│   │   └── v1/              # API version 1
│   │       ├── index.ts     # V1 router with health endpoint
│   │       └── auth.ts      # Authentication routes
│   ├── utils/               # Utility functions (✅ Added)
│   │   └── index.ts         # Username generation and helpers
│   └── server.ts            # Main Express application entry point
├── memory-bank/             # Documentation
├── .env                     # Environment variables (PORT, JWT secrets, etc.)
├── .gitignore               # Git exclusions (node_modules, .env*, dist)
├── .prettierignore          # Prettier exclusion rules
├── package.json             # Project configuration with auth dependencies
├── tsconfig.json            # TypeScript configuration with path mapping
├── nodemon.json             # Development server configuration
├── Blog API.postman_collection.json  # API testing collection
└── readme.md                # Project documentation
```

## Technical Constraints

### Current Limitations
- No complete authentication flow (login, logout, refresh endpoints pending)
- No blog post data models/schemas defined yet
- No testing framework set up  
- No production build scripts defined in package.json
- No additional input validation middleware beyond parsing
- No centralized error handling middleware implemented
- No blog post CRUD API endpoints

### Production Dependencies
- **Core Production**: 
  - express (^5.1.0) - Web framework
  - dotenv (^16.5.0) - Environment variable management
  - mongoose (^8.15.1) - MongoDB ODM for database operations
- **Authentication**: 
  - bcrypt (^3.0.8) - Password hashing
  - jsonwebtoken (^9.0.2) - JWT token generation and validation
- **Logging**: 
  - winston (^3.18.0) - Professional logging system
  - ms (^2.1.3) - Time string parsing for token expiry
- **Middleware**: 
  - compression (^1.8.0) - Response compression middleware
  - cookie-parser (^1.4.7) - Cookie parsing middleware
  - cors (^2.8.5) - Cross-origin resource sharing middleware
  - express-rate-limit (^7.5.0) - Rate limiting middleware
  - helmet (^8.1.0) - Security headers middleware
- **Development**: 
  - @types/express (^5.0.3) - TypeScript definitions for Express
  - @types/node (^22.15.30) - TypeScript definitions for Node.js
  - @types/bcrypt (^5.0.2) - TypeScript definitions for bcrypt
  - @types/jsonwebtoken (^9.0.7) - TypeScript definitions for jsonwebtoken
  - @types/compression (^1.7.5) - TypeScript definitions for compression
  - @types/cookie-parser (^1.4.7) - TypeScript definitions for cookie-parser
  - @types/cors (^2.8.17) - TypeScript definitions for CORS
  - nodemon (^3.1.10) - Development server with hot reloading
  - prettier (^3.5.3) - Code formatting
  - ts-node (^10.9.2) - TypeScript execution for development
  - tsconfig-paths (^4.2.0) - Path mapping support
  - typescript (^5.8.3) - TypeScript compiler

## Architectural Decisions

### Module System Choice
- **Decision**: CommonJS over ES Modules
- **Rationale**: Broader compatibility, simpler Node.js integration
- **Impact**: Affects import/export syntax and file structure

### Framework Selection
- **Decision**: Express.js 5.1.0 for HTTP server
- **Rationale**: Mature, well-documented, extensive TypeScript support
- **Impact**: Established patterns for middleware, routing, and request handling

### Build Strategy
- **Source**: TypeScript files in src/ directory
- **Target**: dist/server.js as main entry point  
- **Compilation**: TypeScript compiler (tsc) transforms .ts to .js
- **Configuration**: tsconfig.json defines compilation settings
- **Module Output**: CommonJS format for Node.js compatibility

### Development Workflow

### Code Quality
- **Formatting**: Prettier for consistent code style
- **Exclusions**: .prettierignore configured for:
  - Dependencies (node_modules/, package-lock.json)
  - Build outputs (dist/, build/, *.tgz)
  - Environment files (.env, .env.local, .env.production)
  - IDE files (.vscode/, .idea/, etc.)
  - Logs and temporary files
- **Commands**: 
  - `npx prettier --write .` (format)
  - `npx prettier --check .` (check)

### Development Server
- **Hot Reloading**: Nodemon watches src/ and config/ directories, plus .env files
- **TypeScript Execution**: ts-node with tsconfig-paths for path mapping
- **Development Command**: `npm run dev` starts nodemon
- **Environment**: Loads .env file with PORT=3000, NODE_ENV, RATE_LIMIT_MAX
- **Path Mapping**: @/* resolves to src/* for clean imports
- **Enhanced Monitoring**: .env file changes trigger automatic restart

### Testing
- **Current**: No test framework configured
- **Script**: `npm test` command removed from package.json
- **Need**: Testing framework selection and setup

## Technology Decisions To Make

1. ✅ **Database**: MongoDB with Mongoose ODM selected and implemented
2. ✅ **Authentication**: JWT with bcrypt password hashing implemented
3. ✅ **Logging**: Winston professional logging system implemented
4. [ ] **Validation**: Zod (TypeScript-first) vs Joi vs class-validator for blog posts
5. [ ] **Testing**: Jest with TypeScript vs Mocha with ts-node
6. [ ] **API Documentation**: OpenAPI/Swagger vs other documentation tools
7. [ ] **Production Build**: Add npm scripts for TypeScript compilation and deployment

## Integration Points

- **Database**: MongoDB with Mongoose ODM - connection and user/token models implemented
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Environment**: Configuration managed by dotenv with .env file (JWT secrets, admin whitelist)
- **Logging**: Winston structured logging solution implemented throughout codebase
- **Error Handling**: Centralized error management planned for blog endpoints
- **API Testing**: Postman collection configured for endpoint testing (needs auth update)

## TypeScript Configuration

### Compiler Options
- **Target**: ES2016 for modern Node.js compatibility
- **Module**: CommonJS to match package.json type setting
- **Strict Mode**: Enabled for enhanced type safety
- **Source Directory**: src/ for all TypeScript source files
- **Output Directory**: dist/ for compiled JavaScript
- **Additional Features**: 
  - ESModule interop for library compatibility
  - Comment removal for cleaner output
  - Consistent file casing enforcement

### Build Process
- **Command**: `tsc` (TypeScript compiler)
- **Input**: src/**/*.ts files
- **Output**: Compiled JavaScript in dist/ directory
- **Watch Mode**: Available for development (tsc --watch)
