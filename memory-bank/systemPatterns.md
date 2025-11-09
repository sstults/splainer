# System Patterns: Splainer React Migration

## System Architecture
The application follows a modular architecture with:
- Legacy AngularJS code in `legacy/` directory
- New React/TypeScript code in `app/` directory
- Separation of concerns between UI components and data services
- Service-oriented design pattern with factories and services

## Key Technical Decisions
- Migration focuses on converting AngularJS controllers to React functional components
- Maintaining compatibility with existing React application structure
- Using TypeScript for type safety and better development experience
- Preserving all existing functionality and UI behavior

## Design Patterns in Use
1. **Service Pattern**: Legacy code uses AngularJS services/factories for data processing
2. **Controller Pattern**: AngularJS controllers manage component logic and state
3. **Factory Pattern**: Search and document normalization services use factory patterns
4. **State Management**: Legacy uses AngularJS scope, new uses React hooks

## Component Relationships
- SearchResults controller depends on multiple services:
  - Search service for search execution
  - Settings service for configuration
  - Field specification service for field handling
  - Document normalization service for result processing
- Services are tightly integrated and communicate through well-defined interfaces

## Critical Implementation Paths
1. **Search Service Integration**: Connecting React component to search functionality
2. **State Management**: Converting AngularJS scope to React hooks
3. **Data Processing**: Migrating document normalization logic
4. **UI Rendering**: Maintaining existing CSS and component structure
5. **Error Handling**: Preserving error states and messaging

## Migration Strategy
- Start with core service interfaces
- Implement React component structure
- Map AngularJS controller logic to React hooks
- Ensure compatibility with existing React application
- Test functionality and UI behavior
