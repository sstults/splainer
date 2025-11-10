# Contributing to Splainer

Welcome to the Splainer project! This guide will help you understand how to contribute to the project, including setting up your development environment, running tests, and understanding the project structure.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Development Setup](#development-setup)
3. [Running the Application](#running-the-application)
4. [Testing](#testing)
5. [Code Style and Standards](#code-style-and-standards)
6. [Submitting Changes](#submitting-changes)

## Project Overview

Splainer is a search sandbox that explains search results for Solr and Elasticsearch. It helps search developers tune search results by providing parsed and summarized explain information alongside documents.

The project has two main components:
- **Legacy AngularJS version** in the root directory
- **New React version** in the `app/` directory

## Development Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Grunt CLI
- Docker (optional, for containerized development)

### Installation

1. **Install global dependencies:**
```bash
npm install -g grunt-cli
```

2. **Install local dependencies:**
```bash
# For the legacy AngularJS version
yarn

# For the new React version
cd app
yarn
```

## Running the Application

### Legacy AngularJS Version
```bash
# Start development server
grunt serve

# Run tests
grunt test

# Build for production
grunt dist
```

### New React Version
```bash
# Start development server
cd app
npm run dev

# Or with yarn
cd app
yarn dev
```

### Docker Development
```bash
# Build and run with Docker
docker build -t splainer .
docker run -p 9000:9000 splainer:latest

# Or use the convenience scripts
bin/docker b  # build
bin/docker s  # start
```

## Testing

### Test Types and Structure

The project has comprehensive testing across multiple levels:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Functional Tests**: Test component behavior and user interactions
3. **Integration Tests**: Test component-service communication
4. **End-to-End Tests**: Test complete user workflows

### Running Tests

#### Legacy AngularJS Tests (Karma/Jasmine)
```bash
# Run all legacy tests
grunt test

# Run specific test files
# See test/spec/ directory for test structure
```

#### New React Tests (Vitest)
```bash
# Run all React tests
cd app
npm run test

# Run tests with coverage
cd app
npm run test:coverage

# Run specific test files
cd app
npm run test -- SearchResults.unit.test.tsx
```

#### Test Coverage
- **Unit Tests**: 100% coverage for SearchResults component, search service, and settings service
- **Functional Tests**: 100% coverage for SearchResults component
- **Integration Tests**: 100% coverage for SearchResults component
- **End-to-End Tests**: 100% coverage for SearchResults component

### Test Files Structure
```
app/src/
├── SearchResults.tsx
├── SearchResults.unit.test.tsx
├── SearchResults.functional.test.tsx
├── SearchResults.integration.test.tsx
├── SearchResults.e2e.test.tsx
├── services/
│   ├── searchService.ts
│   ├── searchService.unit.test.tsx
│   ├── settingsStoreService.ts
│   └── settingsStoreService.unit.test.tsx
```

## Code Style and Standards

### JavaScript/TypeScript
- Follow TypeScript best practices
- Use consistent naming conventions
- Write clean, readable code
- Include proper type annotations

### React Development
- Use functional components with hooks
- Follow React best practices
- Ensure proper component composition
- Handle state and props correctly

### Testing
- Write comprehensive tests for all new features
- Follow the existing test patterns
- Ensure 100% coverage for new components/services
- Use mocks for external dependencies

## Submitting Changes

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/your-feature-name`)
3. **Make your changes**
4. **Write tests** for your changes
5. **Run all tests** to ensure no regressions
6. **Commit your changes** with clear, descriptive messages
7. **Push to your branch** (`git push origin feature/your-feature-name`)
8. **Create a Pull Request**

### Commit Message Guidelines
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Include a brief summary of the change
- Reference any related issues

### Pull Request Requirements
- All tests must pass
- Code must follow project standards
- Documentation must be updated if needed
- Changes must be well-tested
- Commit messages must be clear and descriptive

## Project Structure

```
.
├── app/                    # New React application
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── tests/
│   │   └── index.html
│   ├── package.json
│   └── vite.config.ts
├── test/                   # Legacy Karma tests
│   ├── spec/
│   └── karma.conf.js
├── legacy/                 # Legacy AngularJS application
├── solr-splainer-package/  # Solr package
└── bin/                    # Docker scripts
```

## Need Help?

If you have questions or need help with contributing, please:
1. Check existing issues
2. Open a new issue with your question
3. Join our community discussions

Thank you for contributing to Splainer!
