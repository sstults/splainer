# Project Brief: Splainer React Migration

## Overview
This project involves migrating the Splainer application from AngularJS to a modern React/TypeScript stack. The application is a search sandbox that explains search results from Solr or Elasticsearch, helping developers understand why search results are ranked the way they are.

## Current State
- The legacy application is built with AngularJS (version ~1.8.3)
- The React application is in the `app/` directory with Vite/TypeScript setup
- The migration is focused on converting the SearchResults component
- The AngularJS codebase is in the `legacy/` directory
- The React application uses a modern toolchain with React, TypeScript, and Vite

## Key Components
1. **SearchResults Component**: The main component being migrated
2. **Search Service**: Handles search functionality and data processing
3. **Settings Management**: Stores and retrieves search settings
4. **Field Specification**: Defines which fields to display in search results
5. **Document Normalization**: Processes search results into a consistent format

## Migration Goals
- Convert AngularJS controller logic to React functional component
- Maintain all existing functionality and UI behavior
- Implement proper TypeScript typing
- Ensure compatibility with the existing React application structure
- Preserve the core search explanation and result display features
