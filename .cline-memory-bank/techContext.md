# Technical Context: Splainer TypeScript/React Rewrite

## Technologies Used
- **Frontend**: React 18+, TypeScript 5+, Vite 5+
- **Package Management**: pnpm 9+
- **Testing**: Jest, React Testing Library, Cypress (for E2E)
- **Styling**: CSS Modules or styled-components
- **State Management**: React Context API, potentially Redux Toolkit
- **Build Tools**: Vite for development and production builds
- **HTTP Client**: Axios or native fetch API

## Development Setup
1. Install pnpm 9+ globally
2. Run `pnpm install` in the `app/` directory
3. Development server: `pnpm dev` 
4. Build: `pnpm build`
5. Test: `pnpm test`

## Technical Constraints
- Must maintain compatibility with existing Solr/Elasticsearch endpoints
- Need to preserve all existing functionality from the AngularJS version
- Follow modern TypeScript best practices
- Implement proper error handling and logging
- Ensure responsive design for all screen sizes

## Dependencies (New App)
The new React application will need:
- react, react-dom
- react-router-dom
- typescript
- @types/react, @types/react-dom
- vite
- jest, @testing-library/react
- axios or fetch

## Development Workflow
1. Create initial project structure with Vite
2. Implement core navigation and routing
3. Set up testing infrastructure
4. Begin migrating components from legacy to new app
5. Implement TDD approach with end-to-end tests first
6. Gradually replace legacy functionality with new React components

## Testing Strategy
- **End-to-End Tests**: Cypress for browser automation
- **Functional Tests**: Jest with React Testing Library
- **Integration Tests**: Testing component interactions
- **Unit Tests**: Individual function and component testing
