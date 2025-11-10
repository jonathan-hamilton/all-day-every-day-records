# Tech Stack Documentation

## Overview
Nickel and Dime Records is a full-stack web application for managing and displaying music release catalogs. The project uses a modern React frontend with a PHP/MySQL backend, designed for both public browsing and admin management.

## Frontend Technologies

### Core Framework
- **React 19.0.0** - Modern React with hooks and functional components
- **TypeScript 5.7.2** - Type-safe JavaScript development
- **Vite 6.3.1** - Next-generation build tool with fast HMR (Hot Module Replacement)

### UI Framework & Styling
- **Material-UI (MUI) 7.0.2** - React component library
  - `@mui/material` - Core components (buttons, forms, layout)
  - `@mui/icons-material` - Icon library 
  - `@mui/system` - Styling system
- **Emotion** - CSS-in-JS styling solution (MUI dependency)
  - `@emotion/react` & `@emotion/styled`
- **Custom CSS** - Global styles and component-specific styling
  - CSS Modules for component isolation
  - Custom font integration (NDGrunge)

### Routing & State Management
- **React Router Dom 7.5.1** - Client-side routing with nested routes
- **React Context API** - State management for releases data
- **Local Storage** - User session persistence

### Development Tools
- **ESLint 9.22.0** - Code linting with TypeScript support
- **TypeScript ESLint** - TypeScript-specific linting rules
- **React Hooks ESLint Plugin** - React hooks linting
- **React Refresh ESLint Plugin** - Fast refresh support

## Backend Technologies

### Server Environment
- **PHP 8.2** - Server-side scripting language
- **MySQL** - Relational database management
- **Apache/Nginx** - Web server (production deployment)

### Database & Security
- **MySQLi Extension** - PHP database connectivity
- **Prepared Statements** - SQL injection prevention
- **BCrypt** - Password hashing and verification
- **Session Management** - PHP sessions with secure cookie configuration
- **CORS Handling** - Cross-origin resource sharing configuration

### API Architecture
- **RESTful APIs** - JSON-based API endpoints
- **Authentication Middleware** - Session-based admin authentication
- **Rate Limiting** - Brute force protection
- **File Upload Security** - Multi-layer image validation

## Development Environment

### Build & Deployment
- **Docker** - Containerized development environment
- **Docker Compose** - Multi-service orchestration
- **Nginx** - Reverse proxy and static file serving
- **Multi-stage Dockerfile** - Optimized production builds

### Development Workflow
- **npm Scripts** - Development and build automation
- **Vite Dev Server** - Hot reload development server (port 5173)
- **PHP Built-in Server** - Local API testing (port 8000)

## Database Schema

### Core Entities
- **releases** - Music release records with metadata
- **users** - Admin user accounts with authentication

### Data Types
- Release metadata (title, artist, label, format, date)
- Streaming service URLs (Spotify, YouTube, Apple Music, Amazon)
- Image handling for cover art
- Tag system (featured, new, removed)

## Security Features

### Authentication & Authorization
- **Session-based Authentication** - PHP sessions with secure cookies
- **Admin Role Management** - Protected admin endpoints
- **Cross-origin Session Handling** - Development/production cookie configuration
- **Rate Limiting** - Login attempt throttling

### Data Protection
- **SQL Injection Prevention** - Parameterized queries throughout
- **File Upload Security** - MIME type validation, extension filtering, size limits
- **Input Sanitization** - Data validation and escaping
- **Error Handling** - No information disclosure to clients

### Security Headers & CORS
- **Secure Cookie Configuration** - HTTPOnly, Secure, SameSite settings
- **CORS Whitelist** - Origin-based access control
- **Content Security** - Proper file permissions and directory structure

## Deployment Architecture

### Production Environment
- **DreamHost Hosting** - Shared hosting with MySQL database
- **Static Asset Deployment** - Built React app served as static files
- **API Endpoint Separation** - PHP files in dedicated api directory
- **SSL/HTTPS** - Secure communication in production

### Development Environment
- **Local Development** - React dev server + production API
- **Docker Development** - Full containerized stack
- **Environment Configuration** - Development/production config separation

## File Structure

```
nickel-and-dime-frontend/
├── src/                          # React application source
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Route-based page components
│   ├── layouts/                 # Layout components
│   ├── context/                 # React Context providers
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service functions
│   ├── styles/                  # Styling and theme
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── api/                         # PHP backend APIs
│   ├── config.php              # Database configuration
│   ├── security.php            # Authentication & security utilities
│   └── *.php                   # API endpoints
├── public/                      # Static assets
│   ├── images/                 # Image assets
│   └── fonts/                  # Custom fonts
├── docs/                       # Documentation
├── dist/                       # Production build output
└── docker-compose.yml          # Development environment
```

## API Endpoints

### Public Endpoints
- `GET /api/get-releases.php` - Fetch public releases
- `GET /api/get-releases-by-id.php` - Get specific release
- `GET /api/get-homepage-releases.php` - Featured releases

### Protected Endpoints (Admin Only)
- `POST /api/login.php` - User authentication
- `POST /api/upsert-release.php` - Create/update releases
- `POST /api/delete-release.php` - Delete releases
- `POST /api/upload-image.php` - Upload cover images
- `POST /api/change-password-api.php` - Change admin password

## Performance Optimizations

### Frontend
- **Code Splitting** - Automatic route-based splitting via Vite
- **Asset Optimization** - Image compression and lazy loading
- **Bundle Optimization** - Tree shaking and minification
- **Caching Strategy** - Cache-busting with content hashes

### Backend
- **Database Optimization** - Indexed queries and prepared statements
- **Session Efficiency** - Minimal session data storage
- **Error Logging** - Server-side logging without client exposure

## Development Workflow

### Local Development
1. **Frontend**: `npm run dev` - Vite development server
2. **Backend**: Uses production API or local Docker stack
3. **Build**: `npm run build` - Production build generation
4. **Deploy**: Manual file upload to production server

### Code Quality
- **TypeScript** - Compile-time type checking
- **ESLint** - Code quality and consistency
- **React DevTools** - Component debugging
- **Browser DevTools** - Network and performance analysis

## Dependencies Summary

### Production Dependencies
- React ecosystem (React, ReactDOM, React Router)
- Material-UI component library
- BCrypt for password hashing
- TypeScript for type safety

### Development Dependencies
- Vite build system
- ESLint with React and TypeScript plugins
- TypeScript compiler
- Docker for containerization

## Future Considerations

### Scalability
- **Database**: Migration to dedicated database server
- **CDN**: Static asset delivery optimization
- **Caching**: Redis for session storage and caching
- **Load Balancing**: Multiple server instances

### Security Enhancements
- **Environment Variables**: Secure credential management
- **API Rate Limiting**: Enhanced throttling mechanisms
- **Audit Logging**: Comprehensive action tracking
- **Backup Strategy**: Automated database backups

### Feature Expansion
- **Search Enhancement**: Full-text search capabilities
- **User Management**: Multiple admin levels
- **Analytics**: Usage tracking and reporting
- **Mobile App**: React Native or PWA implementation