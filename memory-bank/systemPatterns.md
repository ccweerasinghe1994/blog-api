# System Patterns: Blog API

## Architecture Overview

### Current Architecture Pattern
- **Pattern**: Express.js HTTP server with TypeScript, MongoDB, complete JWT Authentication, and professional validation
- **Structure**: Modular architecture with complete authentication system, professional logging, express-validator middleware, and secure user management
- **Communication**: HTTP JSON API with complete JWT-based authentication flow (register, login, refresh)
- **Data Layer**: MongoDB with Mongoose ODM for data persistence and user/token management
- **Security**: bcrypt password hashing, JWT tokens, role-based access control with admin whitelist
- **Validation**: Express-validator with comprehensive request validation and custom validators
- **Logging**: Winston professional logging system replacing console.log
- **Development**: Hot reloading with nodemon and ts-node

### Implemented Structure
```
src/
├── config/         # Configuration management (✅ Enhanced)
│   └── index.ts    # Environment config with JWT, admin whitelist, logging
├── controllers/    # Request/response handling (✅ Complete Auth System)
│   └── v1/
│       └── auth/
│           ├── auth.controller.ts    # User registration controller
│           ├── login.controller.ts   # User login controller
│           └── token.controller.ts   # Token refresh controller
├── lib/            # Shared libraries (✅ Expanded)
│   ├── jwt.ts      # JWT token generation and validation
│   ├── mongoose.ts # Database connection management
│   └── winston.ts  # Professional logging configuration
├── middleware/     # Cross-cutting concerns (✅ Complete)
│   ├── compressionMiddleware.ts     # Response compression
│   ├── cookieParserMiddleware.ts    # Cookie parsing
│   ├── corsMiddleware.ts            # Cross-origin requests
│   ├── expressValidationMiddleware.ts # Express-validator error handling
│   ├── helmetMiddleware.ts          # Security headers
│   ├── jsonMiddleware.ts            # JSON body parsing
│   ├── rateLimiterMiddleware.ts     # Rate limiting
│   ├── urlMiddleware.ts             # URL encoding
│   └── index.ts                     # Middleware exports
├── models/         # Data models (✅ Implemented)
│   ├── user.model.ts               # User schema with validation
│   └── token.model.ts              # Refresh token storage
├── routes/         # API routing structure (✅ Enhanced)
│   └── v1/         # API version 1
│       ├── index.ts # V1 router with health check
│       └── auth.ts  # Authentication routes
├── types/          # TypeScript definitions (✅ Complete)
│   └── index.ts    # Auth response types, user types, error types
├── utils/          # Utility functions (✅ Added)
│   └── index.ts    # Username generation and helpers
├── validation/     # Request validation (✅ Complete)
│   ├── common.ts   # Email, password, role validators
│   └── index.ts    # Validation exports
├── server.ts       # Express application entry point (✅ Enhanced)
└── [planned]       # Future: blog models, services, additional controllers
```

### Target Structure (Planned)
```
src/
├── routes/         # API endpoint definitions (✅ Auth routes done)
├── controllers/    # Request/response handling (✅ Auth controller done)
├── services/       # Business logic (✅ JWT services done)
├── models/         # Data models/schemas (✅ User/Token models done)
├── middleware/     # Cross-cutting concerns (✅ Complete)
├── utils/          # Utility functions (✅ Username utils done)
├── config/         # Configuration (✅ Enhanced with JWT/auth)
├── lib/            # Shared libraries (✅ JWT, logging, DB)
└── server.js       # Application entry point (✅ Done)
```

## Design Patterns

### API Design Patterns
- **REST Principles**: Resource-based URLs, HTTP verbs
- **API Versioning**: `/api/v1/posts` and `/api/v1/auth` structure for backward compatibility
- **Endpoint Structure**: Versioned endpoints with clear resource paths
- **Authentication**: JWT-based authentication with access and refresh tokens
- **Authorization**: Role-based access control with user/admin roles
- **Response Format**: Consistent JSON structure with metadata
- **Error Handling**: Standard HTTP status codes with structured error responses
- **Health Checks**: API status endpoint for monitoring
- **Security**: Secure authentication endpoints with password hashing and token management

### Code Organization Patterns
- **Separation of Concerns**: Clear layer boundaries (routes, controllers, models, services)
- **Single Responsibility**: Each module has one purpose
- **Modular Routing**: Express Router for organized endpoint management
- **MVC Pattern**: Model-View-Controller architecture for authentication system
- **Service Layer**: Business logic separated into reusable services (JWT, logging)
- **Utility Pattern**: Helper functions for common operations (username generation)
- **Graceful Shutdown**: Signal handling for production environments
- **Configuration**: Environment-based configuration with security settings

## Key Technical Decisions

### API Structure
```
GET    /api/v1/            # API health check and version info
POST   /api/v1/auth/register # User registration with role validation
POST   /api/v1/auth/login    # User authentication
POST   /api/v1/auth/refresh-token  # Token refresh
GET    /api/v1/posts         # List all posts (planned, with auth)
GET    /api/v1/posts/:id     # Get specific post (planned)
POST   /api/v1/posts         # Create new post (planned, requires auth)
PUT    /api/v1/posts/:id     # Update entire post (planned, requires ownership)
PATCH  /api/v1/posts/:id     # Partial update (planned, requires ownership)
DELETE /api/v1/posts/:id     # Delete post (planned, requires ownership)
```

### Current API Response Structure
```json
// Health check response
{
  "message": "Api v1 is running",
  "version": "1.0.0", 
  "timestamp": "2025-06-07T...",
  "status": "ok",
  "docs": "https://github.com/ccweerasinghe1994/blog-api"
}

// User registration response
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "username": "john_doe_12345",
    "role": "user",
    "createdAt": "2025-01-07T...",
    "updatedAt": "2025-01-07T..."
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..." // HTTP-only cookie
}

// Error response
{
  "message": "Validation failed",
  "error": "Email is required",
  "statusCode": 400
}
```

### Data Flow Pattern
```
Authentication Flow:
Request → Auth Router → Auth Controller → User Model → bcrypt → JWT Service → MongoDB
Response ← Auth Controller ← JWT Tokens ← User Data ← MongoDB

Blog Post Flow (Planned):
Request → JWT Middleware → Blog Router → Blog Controller → Blog Service → Blog Model → MongoDB
Response ← Controller ← Service ← Model ← MongoDB
```

### Authentication Architecture
```
User Registration/Login:
1. Request validation
2. Password hashing (bcrypt)
3. User creation/verification
4. JWT token generation (access + refresh)
5. Refresh token storage (MongoDB)
6. Response with tokens (HTTP-only cookies)

Token Management:
1. Access token validation (JWT middleware)
2. Refresh token rotation
3. Token blacklisting/cleanup
4. Secure cookie handling
```

### Database Architecture
```
Application Layer (Express.js)
    ↓
Data Access Layer (Mongoose ODM)
    ↓  
Database Layer (MongoDB)
```

### Connection Management Pattern
```
Server Startup:
1. Load configuration
2. Connect to database (await)
3. Initialize middleware
4. Start HTTP server

Server Shutdown:
1. Receive shutdown signal
2. Stop accepting new requests
3. Disconnect from database
4. Exit process
```

### Error Handling Pattern
- **Centralized**: Middleware for error processing
- **Consistent**: Standard error response format
- **Logging**: Error tracking and monitoring
- **Graceful**: Proper HTTP status codes

## Component Relationships

### Core Components
1. **Server**: Express.js application setup (✅ Enhanced with auth integration)
2. **Database**: MongoDB connection with Mongoose ODM (✅ Implemented)
3. **Configuration**: Environment-based config management (✅ Enhanced with JWT/auth)
4. **Middleware**: Security, parsing, and performance layers (✅ Implemented)
5. **Routing**: API versioning and endpoint structure (✅ Auth routes added)
6. **Authentication**: JWT-based user authentication system (✅ Implemented)
7. **User Management**: User model with roles and validation (✅ Implemented)
8. **Logging**: Professional Winston logging system (✅ Implemented)
9. **Token Management**: JWT generation and refresh token storage (✅ Implemented)
10. **Password Security**: bcrypt hashing with pre-save middleware (✅ Implemented)
11. **Models**: User and token data schemas (✅ Implemented)
12. **Controllers**: Authentication request/response handling (✅ Started)
13. **Services**: JWT and utility services (✅ Implemented)
14. **Blog Models**: Blog post data schemas (🚧 Next Priority)
15. **Blog Controllers**: Blog CRUD request/response handling (🚧 Planned)
16. **Blog Services**: Blog business logic implementation (🚧 Planned)

### Database Integration
- **Connection**: Async connection management with proper error handling
- **Configuration**: Environment-based MongoDB URI configuration
- **Models**: User model with validation, password hashing, and social links
- **Token Storage**: Refresh token model for JWT lifecycle management
- **Lifecycle**: Database connection tied to server startup/shutdown
- **Options**: Production-ready client options with Server API v1
- **Monitoring**: Application name and database name for MongoDB Atlas/monitoring
- **Error Handling**: Comprehensive connection error management and logging
- **Schema Design**: Mongoose schemas with validation and middleware
- **Relationships**: User-token relationships for authentication management
2. **Configuration**: Environment management with dotenv (✅ Implemented)  
3. **Development**: Hot reloading with nodemon (✅ Implemented)
4. **Middleware Stack**: Production-ready cross-cutting concerns (✅ Implemented)
   - **Security**: Helmet with 15+ security headers
   - **Rate Limiting**: DDoS protection and API throttling
   - **Parsing**: JSON, URL-encoded, and cookie parsing
   - **Performance**: Response compression with gzip/deflate
   - **CORS**: Cross-origin resource sharing with whitelist
5. **Routes**: API endpoint definitions (🚧 Basic root endpoint)
6. **Controllers**: Request handling logic (🚧 Single handler)
7. **Services**: Business logic layer (❌ Not implemented)
8. **Models**: Data structure definitions (❌ Not implemented)

### Integration Points
- **Database**: Data persistence layer (planned)
- **Validation**: Input validation middleware (planned)
- **Authentication**: Security middleware (future)
- **Logging**: Request/response logging (planned)
- **Testing**: API testing with Postman collection (✅ Basic setup)
- **Environment**: Configuration via .env file (✅ Implemented)

## Critical Implementation Paths

### Phase 1: Foundation (✅ COMPLETED)
1. ✅ Express.js server setup
2. ✅ Basic routing structure (root endpoint)
3. ✅ Environment configuration
4. ✅ Development workflow setup

### Phase 2: Middleware Infrastructure (✅ COMPLETED)
1. ✅ Security middleware (Helmet) with 15+ protections
2. ✅ Rate limiting middleware for DDoS protection
3. ✅ Request parsing middleware (JSON, URL-encoded, cookies)
4. ✅ Performance middleware (compression)
5. ✅ CORS middleware with whitelist configuration
6. ✅ Comprehensive JSDoc documentation for all middleware
7. ✅ Production dependencies integration

### Phase 3: Authentication & Security Infrastructure (✅ COMPLETED)
1. ✅ JWT implementation with access and refresh tokens
2. ✅ User model with validation and password hashing
3. ✅ Authentication controller and routes
4. ✅ Role-based access control with admin whitelist
5. ✅ Token storage and management system
6. ✅ Professional logging system integration
7. ✅ Security enhancements and configuration

### Phase 4: Blog Post Implementation (🚧 NEXT PRIORITY)
1. 🚧 Blog post model with user associations
2. ❌ Protected blog post CRUD endpoints
3. ❌ Authentication middleware for protected routes
4. ❌ Authorization logic for user ownership and admin access

### Phase 5: Authentication Completion (❌ PLANNED)
1. ❌ Login endpoint implementation
2. ❌ Token refresh endpoint
3. ❌ Logout endpoint with token cleanup
4. ❌ Password reset functionality

### Phase 5: Enhancement (❌ NOT STARTED)
1. ❌ Advanced querying
2. ❌ Pagination
3. ❌ Sorting and filtering
4. ❌ Performance optimization
5. ❌ Monitoring and logging

## Development Principles

### Code Quality
- **Prettier**: Consistent formatting
- **Modular**: Clear separation of concerns
- **Testable**: Easy to unit test
- **Maintainable**: Clear, readable code

### API Design
- **RESTful**: Follow REST conventions
- **Predictable**: Consistent behavior
- **Documented**: Clear API documentation
- **Versioned**: Future-proof versioning strategy
