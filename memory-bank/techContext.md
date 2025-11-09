# Technical Context: Splainer React Migration

## Technologies Used
- **Frontend**: React 18 with TypeScript, Vite build tool
- **Legacy Codebase**: AngularJS ~1.8.3
- **Styling**: CSS (existing styles to be preserved)
- **Build System**: Vite, TypeScript compiler
- **Testing**: Karma/Jasmine (legacy), potentially new testing framework

## Development Setup
- Node.js environment with pnpm package manager
- Vite development server
- Existing project structure in `/work/app/` directory
- Legacy code in `/work/legacy/` directory

## Technical Constraints
- Must maintain compatibility with existing React application
- Preserve all existing CSS styling and class names
- Keep the same UI/UX behavior and functionality
- Follow React best practices and hooks patterns
- Ensure TypeScript type safety

## Dependencies
- React and React DOM
- TypeScript and TypeScript types
- Vite for development and build
- Existing legacy dependencies (AngularJS, etc.)

## Tool Usage Patterns
- Using pnpm for package management
- Vite for fast development server
- TypeScript for type checking
- React hooks for state management
- Modern JavaScript/ES6+ features

## Code Patterns
- Legacy AngularJS uses scope-based state management
- New React uses hooks-based state management
- Service factories for data processing
- Component-based architecture
- Promise-based asynchronous operations
