# Overview

MuniSat Analytics is a municipal satellite analysis platform designed for government authorities to monitor environmental changes and detect illegal activities through satellite imagery. The application analyzes Sentinel-2 satellite data to detect informal settlements, illegal dumping sites, water pollution, deforestation, and flood-prone areas. It provides an interactive dashboard with map visualization, temporal analysis tools, automated reporting, and alert systems to help municipal planners make data-driven decisions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built as a React single-page application using TypeScript and Vite for development. It follows a modern component-based architecture with:

- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Build System**: Vite for fast development and optimized production builds

The application structure separates concerns with dedicated directories for components, hooks, pages, and utilities. Components are organized using the shadcn/ui pattern with reusable UI primitives and custom business logic components.

## Backend Architecture
The backend uses Node.js with Express.js in an ESM (ES Modules) configuration:

- **Runtime**: Node.js with TypeScript compilation via tsx in development
- **Framework**: Express.js for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: OpenID Connect integration with Replit's authentication system
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple

The API follows RESTful conventions with dedicated routes for detections, alerts, reports, analysis jobs, and dashboard statistics. Error handling and logging middleware provide operational visibility.

## Data Storage Solutions
The application uses PostgreSQL as the primary database with the following schema design:

- **Sessions Table**: Stores user session data for authentication persistence
- **Users Table**: User profiles with role-based access control (analyst, administrator)
- **Detections Table**: Satellite analysis results with location, confidence, area, and status tracking
- **Alerts Table**: Notification system for high-priority detections
- **Reports Table**: Generated analysis reports with metadata and parameters
- **Analysis Jobs Table**: Background processing jobs with progress tracking

Drizzle ORM provides type-safe database queries and schema migrations, with database credentials managed through environment variables.

## Authentication and Authorization
The system implements OpenID Connect authentication through Replit's identity provider:

- **Authentication Flow**: OIDC discovery with automatic token refresh
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Role-based access control with middleware protection
- **Security**: HTTP-only cookies with secure flag for production environments

User sessions persist across browser restarts, and unauthorized requests trigger automatic re-authentication flows.

## Analysis and Detection System
The satellite analysis system is designed around job-based processing:

- **Detection Types**: Supports five categories (settlements, dumping, pollution, deforestation, floods)
- **Confidence Scoring**: Each detection includes confidence percentages and area calculations
- **Temporal Analysis**: Date range filtering for change detection over time
- **Status Tracking**: Detection lifecycle from detected → under investigation → resolved

The system includes parameters for sensitivity adjustment and supports both real-time and batch processing modes.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production deployment
- **Connection Pooling**: Uses @neondatabase/serverless for optimized database connections

## Authentication Services
- **Replit Authentication**: OpenID Connect provider for user identity management
- **Passport.js**: Authentication middleware with OpenID Connect strategy

## UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool with hot module replacement for development
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **TanStack Query**: Data fetching and caching library for API interactions

## Satellite Data Integration
The application is designed to integrate with Sentinel-2 satellite imagery APIs, though specific providers are not yet implemented. The detection system architecture supports pluggable analysis engines for different satellite data sources.

## Mapping and Visualization
The interactive map component is built with custom rendering logic, designed to integrate with mapping services like OpenStreetMap or commercial satellite imagery providers for base map layers and overlay visualizations.