# All Day Every Day Records

A premium music distribution platform and record label website built with modern web technologies.

## Project Overview

All Day Every Day Records is a comprehensive platform for discovering, distributing, and showcasing rap and hip-hop music. The platform features artist profiles, release management, streaming integration, and a community hub for fans and artists.

## Technology Stack

### Frontend
- **React 19.0.0**: Latest React with concurrent features
- **TypeScript 5.7.2**: Type safety and development experience
- **Vite 6.3.1**: Fast development and optimized builds
- **Material-UI 7.0.2**: Modern component library with theming
- **React Router 7.1.0**: Client-side routing with data loading
- **ESLint 9.22.0**: Code quality and consistency

### Development Environment
- **Node.js**: JavaScript runtime
- **npm**: Package management with exact versioning
- **Git**: Version control with structured workflow

## Project Structure

```
all-day-every-day-records/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── layouts/        # Layout components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── services/       # API and external services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── styles/         # Global styles and theme
│   │   └── assets/         # Static assets
│   ├── public/             # Public static files
│   └── package.json        # Dependencies and scripts
├── docs/                   # Project documentation
│   ├── requirements/       # Requirements and planning
│   └── sprints/           # Sprint implementation tracking
└── .prompts/              # Development workflow templates
```

## Project Status

**Overall Progress: 59% Complete** (16/27 stories)

### ✅ Completed Phases
- **Project Scaffolding**: Complete React 19 + TypeScript + Material-UI frontend (3/3 stories)
- **Sprint 1 Foundation**: COMPLETE ✅ (3/3 stories)
  - ✅ PHP Backend API Foundation (simplified N&D-style architecture)  
  - ✅ Database Schema Design & Connection
  - ✅ Frontend-Backend API Integration (axios service layer, TypeScript types)
- **Sprint 2 Core User Features**: COMPLETE ✅ (5/5 stories)
  - ✅ Homepage Featured Releases Carousel with responsive design
  - ✅ Releases Grid Page with search and filtering functionality
  - ✅ Release Detail Pages with YouTube integration and related releases
  - ✅ Homepage YouTube Video Grid with admin-ready backend
  - ✅ Contact Page Implementation with comprehensive contact information

### 🎯 Current Status: Sprint 3 - Admin Features IN PROGRESS

**Current Sprint**: S3 Technical Infrastructure 56% Complete (5/9 stories)
**Latest Achievement**: S3.9 Professional Grunge Theme & Navigation Enhancement COMPLETE ✅ 
**Next Tasks**: Continue with S3.3 Admin CRUD Operations and S3.5 Image Upload System

### Recent Achievements
- **S3.9**: ✅ Professional Grunge Theme & Navigation Enhancement Complete - Industry-standard visual design
  - Professional grunge texture backgrounds applied to header, footer, and main layout with proper containment
  - Custom red triangle navigation cursors for active page indication and enhanced UX
  - Logo integration replacing text branding with full viewport-width immersive layout
  - Square design element consistency across all components (removed rounded corners)
  - Clean admin/public interface separation with optimized background texture performance
- **S3.4.1**: ✅ Service Layer Data Management Cleanup Complete - Production-ready service architecture
  - Service layer refactoring: releaseService.ts reduced from 1,055 to 263 lines (75% reduction)
  - Seed data elimination: Removed all static data arrays and development fallback logic  
  - Component consistency: HomepageFeaturedCarousel renamed to ReleaseCarousel for better naming
  - Type safety improvements: Fixed TypeScript issues, eliminated 'any' types for better type safety
  - API integration streamlined: Exclusive real backend integration, removed development mode conflicts
  - Architecture foundation: Clean service layer ready for admin CRUD operations without data conflicts
- **S3.1**: ✅ Admin Authentication System Complete - Production-ready session-based authentication
  - Authentication system overhaul from complex hybrid to simplified session-based pattern
  - Critical bug resolution: Fixed PHP fatal errors and config global variable access issues
  - Production debugging methodology with surgical error logging and systematic issue resolution
  - Complete API endpoints (get-user-info.php, logout.php) with session management and CORS handling
  - Email-based admin authentication with secure HTTP session cookies and cross-origin development support
- **S2.2**: ✅ Releases Grid Page with Search and Filtering - Complete responsive browsing experience
  - Responsive CSS Grid layout (1/2/3/4 columns) with Material-UI components
  - Debounced search by title/artist with real-time filtering and sorting options
  - Professional loading states with skeleton components and comprehensive error handling
  - ReleaseCard component with hover effects and navigation integration
  - Factory pattern compliant API service integration with existing service layer
- **S2.1**: ✅ Homepage Featured Releases Carousel with Material-UI native components
  - Responsive carousel with touch/swipe support and accessibility features
  - Factory pattern compliant service layer extensions for featured releases
  - Static seed data with realistic cover art for demonstration
  - Complete error handling, loading states, and graceful fallbacks
- **Design Patterns**: Comprehensive documentation for consistent development
- **S1.3**: ✅ Complete API service layer with axios 1.7.7, TypeScript safety, error handling
- **Full-Stack Foundation**: React frontend + PHP backend + MySQL database integration complete

### Latest Infrastructure Improvements (November 16, 2025)
- **Admin Navigation Enhancement**: Implemented dynamic Admin/Logout buttons in navbar based on authentication state
- **Layout Consistency**: Fixed navbar width inconsistencies across all pages with uniform container constraints  
- **API Response Handling**: Resolved releases page data display issue by fixing API response structure mapping
- **Service Layer Optimization**: Improved ReleaseService to properly handle backend API response format
- **Component Simplification**: Removed label filter complexity and streamlined release filtering interface
- **Type Safety Improvements**: Enhanced TypeScript type definitions for API responses and state management

### Previous Completed Stories
- **SC-001**: ✅ React TypeScript Project with Vite and MUI - COMPLETE
- **SC-002**: ✅ Core Application Structure and Routing - COMPLETE
- **SC-003**: ✅ Development Environment and Styling Foundation - COMPLETE
- **Frontend Project**: Fully functional with routing, navigation, custom rap-themed design, and comprehensive styling foundation
- **Next Steps**: Begin Sprint 1 development (authentication system and core features)

## Quick Start

### Prerequisites
- Node.js (Latest LTS version)
- npm package manager
- Git

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd all-day-every-day-records
```

2. Navigate to frontend and install dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

From the `frontend/` directory:

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks
- `npm run lint:fix` - Fix auto-fixable ESLint issues

## Development Workflow

The project follows a structured development approach:

1. **Requirements Phase**: Document features and acceptance criteria
2. **Sprint Planning**: Break down work into incremental deliverables
3. **Implementation**: Develop features with continuous validation
4. **Quality Assurance**: Testing, code review, and documentation
5. **Deployment**: Production release and monitoring

See `.prompts/` directory for detailed workflow templates and processes.

## Contributing

1. Follow the established project structure and naming conventions
2. Maintain TypeScript strict mode compliance
3. Use Material-UI components and theme system
4. Write comprehensive documentation for new features
5. Test all functionality before committing changes

## Documentation

- [Architecture Overview](docs/architecture.md) - System design and technology decisions
- [Vision & Goals](docs/vision.md) - Product vision and business objectives
- [Requirements](docs/requirements/) - Functional and technical requirements
- [Sprint Tracking](docs/sprints/) - Development progress and planning

## License

All rights reserved. This project is proprietary software for All Day Every Day Records.