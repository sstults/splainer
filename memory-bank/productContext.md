# Product Context: Splainer Search Results Migration

## What This Project Does
The Splainer application is a search sandbox that helps developers understand search results from Solr or Elasticsearch. It provides detailed explanations of why documents are ranked the way they are, showing the scoring breakdown for each result.

## How It Should Work
1. Users enter search queries and specify search parameters
2. The application performs searches against Solr/Elasticsearch
3. Results are displayed with detailed explanations of scoring
4. Users can view individual document details and search query information
5. The interface supports different search engines (Solr, Elasticsearch, OpenSearch)

## User Experience Goals
- Maintain the existing UI/UX behavior from the AngularJS version
- Provide clear, actionable search result explanations
- Support both simple and complex search queries
- Enable users to understand search ranking decisions
- Preserve all existing functionality in the new React implementation

## Core Features to Migrate
- Search result display with document scoring
- Query details and parsed query information
- Document explanation functionality
- Search settings management
- Multi-engine support (Solr, ES, OS)
- Pagination support
- Error handling and display

## Technical Constraints
- Must maintain compatibility with existing React application structure
- Should use modern TypeScript patterns
- Need to preserve all existing functionality
- Must integrate with the existing React component ecosystem
- Should follow React best practices and hooks patterns
