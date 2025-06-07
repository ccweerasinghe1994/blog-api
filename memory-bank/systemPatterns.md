# System Patterns: Blog API

## Architecture Overview

### Current Architecture Pattern
- **Pattern**: Express.js HTTP server with TypeScript and MongoDB
- **Structure**: Single server file with modular configuration and database integration
- **Communication**: HTTP JSON API (foundation established)
- **Data Layer**: MongoDB with Mongoose ODM for data persistence
- **Development**: Hot reloading with nodemon and ts-node

### Implemented Structure
```
src/
├── config/         # Configuration management (✅ Implemented)
│   └── index.ts    # Environment config with dotenv and database URI
├── lib/            # Shared libraries (✅ Started)
│   └── mongoose.ts # Database connection management
├── middleware/     # Cross-cutting concerns (✅ Implemented)
│   ├── compressionMiddleware.ts     # Response compression
│   ├── cookieParserMiddleware.ts    # Cookie parsing
│   ├── corsMiddleware.ts            # Cross-origin requests
│   ├── helmetMiddleware.ts          # Security headers
│   ├── jsonMiddleware.ts            # JSON body parsing
│   ├── rateLimiterMiddleware.ts     # Rate limiting
│   ├── urlMiddleware.ts             # URL encoding
│   └── index.ts                     # Middleware exports
├── routes/         # API routing structure (✅ Started)
│   └── v1/         # API version 1
│       └── index.ts # V1 router with health check
├── server.ts       # Express application entry point (✅ Implemented)
└── [planned]       # Future: controllers/, services/, models/
```

### Target Structure (Planned)
```
src/
├── routes/         # API endpoint definitions
├── controllers/    # Request/response handling
├── services/       # Business logic
├── models/         # Data models/schemas
├── middleware/     # Cross-cutting concerns (✅ Complete)
├── utils/          # Utility functions
├── config/         # Configuration (✅ Done)
└── server.js       # Application entry point (✅ Done)
```

## Design Patterns

### API Design Patterns
- **REST Principles**: Resource-based URLs, HTTP verbs
- **API Versioning**: `/api/v1/posts` structure for backward compatibility
- **Endpoint Structure**: Versioned endpoints with clear resource paths
- **Response Format**: Consistent JSON structure with metadata
- **Error Handling**: Standard HTTP status codes
- **Health Checks**: API status endpoint for monitoring

### Code Organization Patterns
- **Separation of Concerns**: Clear layer boundaries (routes, middleware, config)
- **Single Responsibility**: Each module has one purpose
- **Modular Routing**: Express Router for organized endpoint management
- **Graceful Shutdown**: Signal handling for production environments
- **Configuration**: Environment-based configuration

## Key Technical Decisions

### API Structure
```
GET    /api/v1/            # API health check and version info
GET    /api/v1/posts       # List all posts (planned)
GET    /api/v1/posts/:id   # Get specific post (planned)
POST   /api/v1/posts       # Create new post (planned)
PUT    /api/v1/posts/:id   # Update entire post (planned)
PATCH  /api/v1/posts/:id   # Partial update (planned)
DELETE /api/v1/posts/:id   # Delete post (planned)
```

### Current API Response Structure
```json
{
  "message": "Api v1 is running",
  "version": "1.0.0", 
  "timestamp": "2025-06-07T...",
  "status": "ok",
  "docs": "https://github.com/ccweerasinghe1994/blog-api"
}
```

### Data Flow Pattern
```
Request → Router → Controller → Service → Model → MongoDB
Response ← Controller ← Service ← Model ← MongoDB
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
1. **Server**: Express.js application setup (✅ Implemented)
2. **Database**: MongoDB connection with Mongoose ODM (✅ Implemented)
3. **Configuration**: Environment-based config management (✅ Implemented)
4. **Middleware**: Security, parsing, and performance layers (✅ Implemented)
5. **Routing**: API versioning and endpoint structure (✅ Started)
6. **Models**: Data schemas and validation (🚧 Next Priority)
7. **Controllers**: Request/response handling (🚧 Planned)
8. **Services**: Business logic implementation (🚧 Planned)

### Database Integration
- **Connection**: Async connection management with proper error handling
- **Configuration**: Environment-based MongoDB URI configuration
- **Lifecycle**: Database connection tied to server startup/shutdown
- **Options**: Production-ready client options with Server API v1
- **Monitoring**: Application name and database name for MongoDB Atlas/monitoring
- **Error Handling**: Comprehensive connection error management and logging
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

### Phase 3: Core Features (🚧 NEXT PRIORITY)
1. 🚧 API route structure planning
2. ❌ Blog post model definition
3. ❌ CRUD operations implementation
4. ❌ Input validation middleware (building on existing parsing)
5. ❌ Error handling middleware (complementing security)
6. ❌ Response formatting

### Phase 4: Database Integration (❌ NOT STARTED)
1. ❌ Database connection setup
2. ❌ Model/schema definitions
3. ❌ Migration system
4. ❌ Data persistence layer

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
