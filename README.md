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

- **Current Phase**: Project Scaffolding Complete ✅ (3/3 Stories)
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