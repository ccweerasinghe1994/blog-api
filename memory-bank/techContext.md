# Technical Context: Blog API

## Technology Stack

### Core Technologies
- **Runtime**: Node.js
- **Module System**: CommonJS (`"type": "commonjs"`)
- **Entry Point**: dist/server.js (compiled/built output)

### Development Tools
- **Code Formatting**: Prettier (^3.5.3)
- **Code Quality**: .prettierignore for selective formatting
- **Package Manager**: npm

### Project Configuration
- **Package.json**: Standard Node.js project structure
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
├── dist/           # Compiled output
├── src/            # Source code (to be created)
├── memory-bank/    # Documentation
├── .prettierignore # Prettier exclusion rules
├── package.json    # Project configuration
└── readme.md       # Project documentation
```

## Technical Constraints

### Current Limitations
- No database configured yet
- No testing framework set up
- No build/compilation process defined
- No environment configuration

### Dependencies
- **Production**: None currently
- **Development**: Prettier only

## Architectural Decisions

### Module System Choice
- **Decision**: CommonJS over ES Modules
- **Rationale**: Broader compatibility, simpler Node.js integration
- **Impact**: Affects import/export syntax and file structure

### Build Strategy
- **Target**: dist/server.js as main entry point
- **Implication**: Source code will be in src/ directory
- **Requirement**: Build process needed for src/ → dist/ transformation

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
2. **Framework**: Express.js vs alternatives
3. **Validation**: Input validation library
4. **Testing**: Jest, Mocha, or other testing framework
5. **Build Process**: TypeScript, Babel, or plain JavaScript
6. **Environment**: Configuration management strategy

## Integration Points

- **Database**: TBD - will need connection and ORM/ODM
- **Environment**: Configuration for different environments
- **Logging**: Structured logging solution
- **Error Handling**: Centralized error management
