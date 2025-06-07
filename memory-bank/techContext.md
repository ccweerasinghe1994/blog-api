# Technical Context: Blog API

## Technology Stack

### Core Technologies
- **Runtime**: Node.js
- **Language**: TypeScript (^5.8.3)
- **Module System**: CommonJS (`"type": "commonjs"`)
- **Entry Point**: dist/server.js (compiled from TypeScript)
- **Build Target**: ES2016 for modern Node.js compatibility

### Development Tools
- **Code Formatting**: Prettier (^3.5.3)
- **Code Quality**: .prettierignore for selective formatting
- **Type System**: TypeScript compiler (tsc)
- **Package Manager**: npm

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
├── dist/           # Compiled TypeScript output
├── src/            # TypeScript source code
│   └── server.ts   # Main application entry point
├── memory-bank/    # Documentation
├── .prettierignore # Prettier exclusion rules
├── package.json    # Project configuration
├── tsconfig.json   # TypeScript configuration
└── readme.md       # Project documentation
```

## Technical Constraints

### Current Limitations
- No database configured yet
- No testing framework set up
- No build scripts defined in package.json
- No environment configuration
- Empty server.ts file needs implementation

### Dependencies
- **Production**: None currently
- **Development**: Prettier, TypeScript

## Architectural Decisions

### Module System Choice
- **Decision**: CommonJS over ES Modules
- **Rationale**: Broader compatibility, simpler Node.js integration
- **Impact**: Affects import/export syntax and file structure

### Build Strategy
- **Source**: TypeScript files in src/ directory
- **Target**: dist/server.js as main entry point  
- **Compilation**: TypeScript compiler (tsc) transforms .ts to .js
- **Configuration**: tsconfig.json defines compilation settings
- **Module Output**: CommonJS format for Node.js compatibility

## Development Workflow

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

### Testing
- **Current**: No test framework configured
- **Script**: `npm test` returns error message
- **Need**: Testing framework selection and setup

## Technology Decisions To Make

1. **Database**: Choose database system (MongoDB, PostgreSQL, etc.)
2. **Framework**: Express.js vs alternatives (with TypeScript support)
3. **Validation**: Zod (TypeScript-first) vs Joi vs class-validator
4. **Testing**: Jest with TypeScript vs Mocha with ts-node
5. **Type Definitions**: @types packages for chosen libraries
6. **Build Scripts**: Add npm scripts for TypeScript compilation

## Integration Points

- **Database**: TBD - will need connection and ORM/ODM
- **Environment**: Configuration for different environments
- **Logging**: Structured logging solution
- **Error Handling**: Centralized error management

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
