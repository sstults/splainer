# Active Context: Splainer TypeScript/React Rewrite

## Current Work Focus
- Setting up monorepo structure with legacy and new applications
- Verifying legacy application functionality 
- Bootstrapping new React/TypeScript application
- Implementing test-driven development approach
- Preparing for migration of legacy components
- Implementing core UI components from legacy AngularJS application

## Recent Changes
- Created monorepo structure with `legacy/` and `app/` directories
- Moved legacy AngularJS application to `legacy/` directory
- `app/` directory is now empty and ready for React/TypeScript implementation
- Established memory bank documentation structure
- Legacy app verified to have all original files in `legacy/` directory
- Successfully configured TDD environment with Vite and Vitest
- Implemented initial App component tests
- Analyzed legacy SearchResults component implementation
- Created comprehensive SearchResults component with React/TypeScript
- Implemented stacked chart visualization component
- Added proper CSS styling for new components
- Maintained existing test structure and patterns

## Next Steps
1. Continue implementing UI components from legacy application
2. Implement core navigation and routing system
3. Set up API communication layer
4. Implement data fetching and state management
5. Continue building out TDD approach with end-to-end tests
6. Migrate remaining legacy components

## Active Decisions and Considerations
- Using Vite as build tool for faster development experience
- Implementing TDD from end-to-end down to unit tests
- Maintaining monorepo structure to support both applications
- Following React/TypeScript best practices and patterns
- Preserving all existing functionality from legacy AngularJS version
- Using TypeScript interfaces for type safety
- Component-based architecture with proper separation of concerns

## Important Patterns and Preferences
- Component-based architecture with React
- TypeScript for type safety
- Test-driven development approach
- Modern CSS styling approaches with proper class naming
- Clean separation of concerns
- Reusable custom components
- Proper state management patterns

## Learnings and Project Insights
- Legacy AngularJS application is well-structured with clear separation of controllers, services, and views
- Need to understand the data flow and API endpoints from the legacy app
- Testing infrastructure is already in place with Karma/Jasmine
- TDD approach is now properly configured and ready for implementation
- The React/TypeScript environment is fully functional and tested
- Stacked chart visualization is a key component for score representation
- Query details toggling functionality is important for debugging
- Pagination and search result display patterns are well-defined in legacy code
- The legacy app uses a specific structure for document rows with score visualization and snippets
- Loading states and error handling are essential for user experience
- The legacy application has a complex but well-defined component hierarchy
- Progress bar visualization is implemented using CSS styling with width transitions
- The application uses a consistent color scheme and styling approach throughout
