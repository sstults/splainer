# System Patterns: Splainer TypeScript/React Rewrite

## System Architecture
The application follows a monorepo structure with:
- `legacy/` directory: Contains the original AngularJS application (read-only for now)
- `app/` directory: Contains the new React/TypeScript application
- Shared configuration and tools at the root level

## Key Technical Decisions
1. **Frontend Framework**: React with TypeScript for type safety and modern development
2. **Build Tool**: Vite for fast development server and optimized builds
3. **Package Management**: pnpm for fast, reliable dependency management
4. **Testing Approach**: Test-Driven Development (TDD) with end-to-end, functional, integration, and unit tests
5. **State Management**: React Context API and/or Redux Toolkit for state management
6. **Styling**: CSS Modules or styled-components for scoped styling
7. **API Communication**: Axios or fetch API for HTTP requests

## Design Patterns in Use
1. **Component-Based Architecture**: Reusable React components
2. **Separation of Concerns**: Clear distinction between presentation, logic, and data layers
3. **Functional Programming**: Emphasis on pure functions and immutable data
4. **Async/Await Pattern**: For handling asynchronous operations
5. **Error Boundaries**: For graceful error handling in React components

## Component Relationships
- **Presentational Components**: UI components that handle display
- **Container Components**: Components that handle data fetching and state
- **Custom Hooks**: Reusable logic that can be shared across components
- **Services**: Business logic and API interaction layers

## Critical Implementation Paths
1. **Environment Setup**: Vite + React + TypeScript + pnpm
2. **Core Navigation**: Routing system for the application
3. **API Integration**: Communication with Solr/Elasticsearch backends
4. **UI Components**: Rebuilding key UI elements from legacy application
5. **Testing Strategy**: Implementing TDD approach from end-to-end down to unit tests
