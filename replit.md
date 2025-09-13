# Overview

MuniSat Analytics is a municipal satellite analysis platform designed for government authorities to monitor environmental changes and detect illegal activities through satellite imagery. The application provides comprehensive analysis capabilities for informal settlements, waste management, water quality monitoring, deforestation, and flood risk assessment. It combines machine learning models for satellite image analysis with an intuitive web interface for municipal planning and environmental protection.

## MVP Status - Complete ✅

The MVP (Minimum Viable Product) has been successfully completed with all core features implemented:

### Core Features Delivered
- **YOLO Machine Learning Model**: Integrated YOLOv8 for informal settlement and illegal dumping detection
- **Interactive Dashboard**: Leaflet map interface with layer toggles and detection visualization  
- **Detection Management**: Modal interface showing confidence scores, location details, and metadata
- **Alert System**: Automated notifications for high-priority detections with SMS simulation
- **Report Generation**: PDF report creation using ReportLab for analysis summaries
- **API Integration**: Complete REST API with endpoints for detections, analysis, and reporting
- **Sample Data**: 25+ sample detections across Johannesburg area for demonstration

### Recent Updates (September 13, 2025)
- Fixed critical database schema migration issues for production deployment
- Added proper environment variable management for API keys (security enhancement)
- Implemented database migration script for PostgreSQL compatibility
- Created comprehensive sample dataset for MVP demonstration
- Resolved all blocking import and dependency issues

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
- **Authorization**: Role-based access control with middleware protection for API endpoints
- **User Management**: Automatic user provisioning and profile management

## External Dependencies

### Third-Party Services
- **Replit Authentication**: OpenID Connect provider for user authentication and identity management
- **PostgreSQL Database**: Primary data storage via Neon or similar PostgreSQL providers
- **Satellite Imagery APIs**: Integration points for Sentinel-2 and other satellite data sources

### Machine Learning Dependencies
- **TensorFlow/Keras**: Deep learning framework for satellite image analysis models
- **OpenCV**: Computer vision library for image processing and feature extraction
- **Scikit-learn**: Machine learning algorithms for classification and clustering
- **NumPy/Pandas**: Data manipulation and numerical computing libraries

### Development Tools
- **Drizzle Kit**: Database migration and schema management
- **shadcn/ui**: Component library built on Radix UI primitives
- **TanStack Query**: Server state management and caching
- **Zod**: Schema validation for API requests and responses

### Infrastructure
- **Express Session Store**: PostgreSQL-backed session storage for scalability
- **File Upload Handling**: Multer or similar for satellite image uploads
- **Environment Configuration**: dotenv for local development and environment variable management