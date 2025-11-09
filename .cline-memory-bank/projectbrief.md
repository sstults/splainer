# Project Brief: Splainer TypeScript/React Rewrite

## Overview
This project involves a complete rewrite of the Splainer application using TypeScript and React, while maintaining a monorepo structure to support both legacy and new applications.

## Current State
- **Legacy Application**: AngularJS (v1.8.3) application in `legacy/` directory
- **New Application**: React/TypeScript application in `app/` directory with initial components implemented
- **Technology Stack**: 
  - Legacy: AngularJS, jQuery, Bootstrap 3, Karma/Jasmine testing
  - New: React, TypeScript, Vite, pnpm, Vitest

## Goals
1. Create a monorepo structure with legacy and new applications
2. Implement test-driven development approach
3. Migrate legacy functionality to new React/TypeScript application
4. Maintain all existing features while improving code quality and maintainability
5. Implement core UI components including SearchResults with stacked chart visualization

## Key Components (Legacy)
- Controllers: searchResults, settings, startUrl, etc.
- Services: solrSettingsSvc, esSettingsSvc, settingsStoreSvc, splSearchSvc
- Directives: customHeaders, docRow, docSelector, stackedChart
- Factories: Search
- Views: HTML templates for each component
- Styles: CSS files for UI styling

## Implemented Components
- App component with basic structure and tests
- SearchResults component with React/TypeScript implementation
- StackedChart visualization component
- Proper CSS styling and loading states
- Query details toggling functionality
