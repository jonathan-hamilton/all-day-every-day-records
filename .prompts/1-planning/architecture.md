# [Project Name] - System Architecture

**Role**: Technical Architecture Specialist

**Command**: `define-architecture`

When you see this command, activate this role:

You are a Technical Architecture Specialist responsible for defining system design, technology stack decisions, design patterns, and development guidelines that ensure scalable, maintainable, and robust software solutions.

## System Overview

**[Project Name]** is a [architecture type - full-stack web application, API service, CLI tool, etc.] built with [primary technology stack]. The system [high-level description of what it does and primary user workflow].

The application is designed for [key architectural goals - modularity, scalability, performance, etc.] using established design patterns and modern development practices.

---

## Technology Stack

### Backend
- **Framework**: [Backend framework and version] (ASP.NET Core 8, Express.js 4, FastAPI 0.104, Spring Boot 3)
- **Language**: [Programming language and version] (C# 12, Node.js 20, Python 3.11, Java 21)
- **Database**: [Database technology and approach] (PostgreSQL 15, MongoDB 7, SQLite 3, Azure SQL)
- **Authentication**: [Auth strategy if applicable] (JWT, OAuth2, Auth0, Azure AD)
- **External Services**: [Third-party integrations] (OpenAI API, Stripe, SendGrid, Azure Services)

### Frontend
- **Framework**: [Frontend framework and version] (React 18, Vue 3, Angular 17, Svelte 4)
- **Language**: [Programming language/TypeScript] (TypeScript 5.3, JavaScript ES2023)
- **Build Tools**: [Build system and tooling] (Vite 5, Webpack 5, Turbo, esbuild)
- **UI Library**: [Component library if used] (Material-UI 5, Chakra UI 2, Tailwind CSS 3, Ant Design 5)
- **State Management**: [State management approach] (Zustand 4, Redux Toolkit 2, Pinia 2, Context API)

### Development Tools
- **Version Control**: [Git hosting and strategy] (GitHub, GitLab, Bitbucket)
- **Testing**: [Testing frameworks and approach] (Jest, Vitest, Playwright, Cypress)
- **Linting/Formatting**: [Code quality tools] (ESLint, Prettier, SonarQube, Biome)
- **Documentation**: [Documentation approach] (JSDoc, Storybook, Docusaurus, GitBook)

### Deployment
- **Hosting**: [Hosting platform and strategy] (Azure App Service, Vercel, AWS, Docker)
- **CI/CD**: [Deployment automation approach] (GitHub Actions, Azure DevOps, GitLab CI)
- **Monitoring**: [Logging and monitoring if planned] (Application Insights, Sentry, DataDog)
- **Environment Management**: [Development/staging/production strategy] (Docker, Terraform, Kubernetes)

---

## Design Patterns

### Backend Patterns
- **Service Layer**: [How you organize business logic] (Business logic in services, not controllers; IEmailService, IUserService with dependency injection)
- **Repository Pattern**: [Data access approach] (Entity Framework DbContext, clean separation of concerns)
- **Dependency Injection**: [How you manage dependencies] (Constructor injection, service registration in Program.cs)
- **Factory Pattern**: [Object creation strategy] (Service factories, configuration-based implementations)

### Frontend Patterns
- **State Management**: [How you handle global state] (Zustand stores, Redux Toolkit, avoid local React state for shared data)
- **Component Composition**: [Component design approach] (Reusable UI components, Props-based configuration, children pattern, render props)
- **Custom Hooks**: [Logic reuse strategy] (API calls, form handling, business logic separation)
- **Provider Pattern**: [Dependency injection approach] (Context providers, theme providers, auth providers)

---

## API Design

### Endpoints

#### [Endpoint Category] (Authentication, File Upload, User Management)
- **[HTTP Method] [Endpoint Path]**: [Description of what this endpoint does] (POST /api/auth/login, GET /api/users/profile)
  - **Input**: [Request format and required parameters] (JSON with email/password, Bearer token in header)
  - **Output**: [Response format and data structure] (JWT token with user info, User profile object)
  - **Purpose**: [Business logic and use case] (Authenticate user and return session token)

#### [Endpoint Category] (Data Processing, Reporting, Admin Functions)
- **[HTTP Method] [Endpoint Path]**: [Description] (POST /api/files/process, GET /api/admin/reports)
  - **Input**: [Request specification] (Multipart file upload, Query parameters for date range)
  - **Output**: [Response specification] (Processing job ID, CSV report data)
  - **Purpose**: [Functionality description] (Queue file for background processing)

---

## Security Considerations

### [Security Category 1] (Authentication & Authorization, Data Protection, API Security)
- **[Security Measure]**: [Implementation approach and rationale] (JWT tokens with 15-minute expiry, OAuth2 integration)
- **[Security Measure]**: [Protection strategy and coverage] (Input validation on all endpoints, SQL injection prevention)
- **[Security Measure]**: [Compliance and standards] (HTTPS only, GDPR data handling, SOC2 compliance)

### [Security Category 2] (Infrastructure Security, Monitoring, Incident Response)
- **[Security Requirement]**: [Implementation details] (Rate limiting per IP, CORS configuration, CSP headers)
- **[Security Requirement]**: [Monitoring and validation] (Security event logging, anomaly detection, audit trails)
- **[Security Requirement]**: [Future considerations] (Penetration testing, security reviews, vulnerability scanning)

---

## Development Guidelines

### Code Organization
- **Folder Structure**: Feature-based organization with clear separation of concerns (src/components, src/services, src/utils, src/types)
- **Naming Conventions**: PascalCase for components/classes, camelCase for functions/variables, kebab-case for files
- **Import Organization**: External imports first, then internal imports, grouped and sorted alphabetically
- **File Structure**: One main export per file, co-locate related files, index.js for clean imports

### Documentation-Driven Development Process
- **Phase 1**: Create vision.md and architecture.md (project purpose, mission, success criteria, technologies, design patterns)
- **Phase 2**: Define requirements (generate-initial-project-requirements.md)
- **Phase 3**: Create requirements-roadmap.md (generate-requirements-roadmap.md)
- **Phase 4**: Scaffold project (generate-project-scaffolding-user-stories.md)
- **Phase 5**: Create sprint stories (generate-next-sprint-user-stories.md)
- **Phase 6**: Create Implementation Plan & Implement (implement-story.md)
- **Phase 7**: Code Review & Pattern Validation (code-review-pattern-checklist.md)
- **Phase 8**: Update documentation (update-commit.md)
- **Phase 9**: Testing and validation (generate-api-tests.md, generate-frontend-tests.md)

### Pattern Compliance
- **[Compliance Requirement]**: [Enforcement mechanism] (Code review checklist validates design patterns)
- **[Compliance Requirement]**: [Validation process] (Automated linting rules, pre-commit hooks, CI/CD checks)
- **[Compliance Requirement]**: [Review and approval process] (Architecture review for pattern deviations, peer review required)

---

## Future Considerations

### Planned Enhancements
- **[Enhancement Category]**: [Description of planned improvements] (Mobile app development, API v2, real-time features)
- **[Enhancement Category]**: [Timeline and implementation approach] (Q2 2024 release, phased rollout, beta testing)
- **[Enhancement Category]**: [Business value and technical benefits] (Increased user engagement, improved performance, new revenue streams)

### Scalability Considerations
- **[Scalability Concern]**: [Approach and technical strategy] (Horizontal scaling, microservices migration, caching layer)
- **[Scalability Concern]**: [Performance targets and monitoring] (10x user growth, <200ms response time, 99.9% uptime)
- **[Scalability Concern]**: [Infrastructure and deployment considerations] (Auto-scaling groups, load balancers, CDN implementation)