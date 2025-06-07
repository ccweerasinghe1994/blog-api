# System Patterns: Blog API

## Architecture Overview

### Current Architecture Pattern
- **Pattern**: Express.js HTTP server with TypeScript
- **Structure**: Single server file with modular configuration
- **Communication**: HTTP JSON API (foundation established)
- **Development**: Hot reloading with nodemon and ts-node

### Implemented Structure
```
src/
├── config/         # Configuration management (✅ Implemented)
│   └── index.ts    # Environment config with dotenv
├── middleware/     # Cross-cutting concerns (✅ Implemented)
│   ├── compressionMiddleware.ts     # Response compression
│   ├── cookieParserMiddleware.ts    # Cookie parsing
│   ├── corsMiddleware.ts            # Cross-origin requests
│   ├── helmetMiddleware.ts          # Security headers
│   ├── jsonMiddleware.ts            # JSON body parsing
│   ├── rateLimiterMiddleware.ts     # Rate limiting
│   ├── urlMiddleware.ts             # URL encoding
│   └── index.ts                     # Middleware exports
├── server.ts       # Express application entry point (✅ Implemented)
└── [planned]       # Future: routes/, controllers/, services/, models/
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
- **Endpoint Structure**: `/api/posts` for blog posts
- **Response Format**: Consistent JSON structure
- **Error Handling**: Standard HTTP status codes

### Code Organization Patterns
- **Separation of Concerns**: Clear layer boundaries
- **Single Responsibility**: Each module has one purpose
- **Dependency Injection**: Services injected into controllers
- **Configuration**: Environment-based configuration

## Key Technical Decisions

### API Structure
```
GET    /api/posts      # List all posts
GET    /api/posts/:id  # Get specific post
POST   /api/posts      # Create new post
PUT    /api/posts/:id  # Update entire post
PATCH  /api/posts/:id  # Partial update
DELETE /api/posts/:id  # Delete post
```

### Data Flow Pattern
```
Request → Router → Controller → Service → Model → Database
Response ← Controller ← Service ← Model ← Database
```

### Error Handling Pattern
- **Centralized**: Middleware for error processing
- **Consistent**: Standard error response format
- **Logging**: Error tracking and monitoring
- **Graceful**: Proper HTTP status codes

## Component Relationships

### Core Components
1. **Server**: Express.js application setup (✅ Implemented)
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
