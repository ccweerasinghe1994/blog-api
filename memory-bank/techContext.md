# Technical Context: Blog API

## Technology Stack

### Core Technologies
- **Runtime**: Node.js
- **Language**: TypeScript (^5.8.3)
- **Framework**: Express.js (^5.1.0) for HTTP server
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
- **Type Definitions**: @types/express, @types/node for TypeScript support

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
├── dist/                    # Compiled TypeScript output
├── src/                     # TypeScript source code
│   ├── config/              # Environment configuration
│   │   └── index.ts         # Configuration module with dotenv
│   └── server.ts            # Main Express application entry point
├── memory-bank/             # Documentation
├── .env                     # Environment variables (PORT=3000)
├── .prettierignore          # Prettier exclusion rules
├── package.json             # Project configuration with Express deps
├── tsconfig.json            # TypeScript configuration with path mapping
├── nodemon.json             # Development server configuration
├── Blog API.postman_collection.json  # API testing collection
└── readme.md                # Project documentation
```

## Technical Constraints

### Current Limitations
- No database configured yet
- No testing framework set up  
- No production build scripts defined in package.json
- No input validation middleware
- No error handling middleware implemented
- No API route structure beyond root endpoint

### Dependencies
- **Production**: 
  - express (^5.1.0) - Web framework
  - dotenv (^16.5.0) - Environment variable management
- **Development**: 
  - @types/express (^5.0.3) - TypeScript definitions for Express
  - @types/node (^22.15.30) - TypeScript definitions for Node.js
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
- **Hot Reloading**: Nodemon watches src/ and config/ directories
- **TypeScript Execution**: ts-node with tsconfig-paths for path mapping
- **Development Command**: `npm run dev` starts nodemon
- **Environment**: Loads .env file with PORT=3000
- **Path Mapping**: @/* resolves to src/* for clean imports

### Testing
- **Current**: No test framework configured
- **Script**: `npm test` command removed from package.json
- **Need**: Testing framework selection and setup

## Technology Decisions To Make

1. **Database**: Choose database system (MongoDB, PostgreSQL, etc.)
2. **Validation**: Zod (TypeScript-first) vs Joi vs class-validator  
3. **Testing**: Jest with TypeScript vs Mocha with ts-node
4. **Additional Type Definitions**: @types packages for chosen libraries
5. **Production Build**: Add npm scripts for TypeScript compilation and deployment
6. **API Documentation**: OpenAPI/Swagger vs other documentation tools

## Integration Points

- **Database**: TBD - will need connection and ORM/ODM
- **Environment**: Configuration managed by dotenv with .env file
- **Logging**: Structured logging solution (planned)
- **Error Handling**: Centralized error management (planned)
- **API Testing**: Postman collection configured for endpoint testing

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
