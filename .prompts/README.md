# Template Ecosystem for Documentation-Driven Development

This folder contains a comprehensive set of templates for implementing documentation-driven development across any technology stack. The templates are designed to work together as an integrated ecosystem, guiding you through the complete project lifecycle from initial vision to ongoing maintenance.

## Template Organization

### 📁 1-planning/ - Project Foundation (Phases 1-3)
Core project documentation templates that establish foundation and technology stack:

- **vision.md** - Project purpose, mission statement, and success criteria
- **architecture.md** - System design, technology stack, and development guidelines  
- **detect-project-stack.md** - Technology stack detection and recommendations

### 📁 2-requirements/ - Requirements & Planning (Phases 2-3)
Requirements gathering and roadmap planning templates:

- **generate-initial-project-requirements.md** - Requirements gathering and analysis
- **generate-requirements-roadmap.md** - Timeline and milestone planning

### 📁 3-development/ - Development Execution (Phases 4-6)
Development and implementation workflow templates:

- **generate-project-scaffolding-user-stories.md** - Initial project structure and stories
- **generate-next-sprint-user-stories.md** - Sprint planning and story creation
- **implement-story.md** - Implementation planning and execution

### 📁 4-quality/ - Quality Assurance (Phases 7-9)
Testing and quality validation templates:

- **code-review-pattern-checklist.md** - Design pattern compliance validation
- **generate-api-tests.md** - Backend testing strategy and implementation
- **generate-frontend-tests.md** - Frontend testing approach and execution

### 📁 5-workflow/ - Process & Maintenance (Phase 8)
Documentation maintenance and workflow templates:

- **update-commit.md** - Documentation maintenance and git workflow

### 📄 Root Templates
General ecosystem guidance:

- **documentation-map.md** - Documentation structure and navigation guide

## Development Process Flow

The templates implement a 9-phase documentation-driven development process:

1. **Vision & Architecture** → Create project foundation (vision.md, architecture.md)
2. **Requirements Gathering** → Define detailed specifications (requirements.md)
3. **Roadmap Planning** → Create timeline and milestones (requirements-roadmap.md)
4. **Project Scaffolding** → Generate initial structure and stories
5. **Sprint Planning** → Create actionable user stories for development
6. **Implementation** → Build features with implementation documentation
7. **Code Review** → Validate design pattern compliance and code quality
8. **Documentation Update** → Maintain docs and commit changes
9. **Testing & Validation** → Comprehensive testing strategy and execution

## Technology Agnostic Design

All templates use placeholder variables for technology-specific content:

- **[Project Name]** - Your project's name
- **[Technology Stack]** - Your chosen technologies (React, ASP.NET Core, Python, etc.)
- **[Framework]** - Specific frameworks and versions
- **[Database]** - Database technology and approach
- **[Hosting Platform]** - Deployment and hosting strategy

## Getting Started

### For New Projects
1. Start with `1-planning/detect-project-stack.md` to identify your technology stack
2. Use `1-planning/vision.md` to create your project's vision.md
3. Adapt `1-planning/architecture.md` to create your architecture.md
4. Follow the 9-phase process using the phase-organized templates

### For Existing Projects
1. Create missing documentation using the foundation templates in `1-planning/`
2. Use the phase-organized templates to generate additional documentation
3. Implement the code review checklist from `4-quality/` for ongoing quality assurance
4. Adopt the update-commit workflow from `5-workflow/` for documentation maintenance

## Template Customization

### Adapting Templates
- Replace placeholder variables with your project specifics
- Modify examples to match your technology stack
- Adjust sections based on your project's complexity and requirements
- Add custom sections for domain-specific needs

### Template Dependencies
- Architecture template references the code review checklist
- Implementation templates assume architecture patterns are defined
- Testing templates reference requirements and implementation documentation
- Update-commit workflow integrates with all other templates

## Best Practices

### Documentation Quality
- Keep documentation current with code changes
- Use consistent terminology across all documents
- Include practical examples and code snippets
- Make documentation discoverable and navigable

### Template Usage
- Start with the foundation templates (vision, architecture)
- Use prompt templates for AI-assisted content generation
- Validate pattern compliance during code reviews
- Maintain documentation through the update-commit workflow

### Team Collaboration
- Establish documentation standards and review processes
- Use templates to ensure consistency across team members
- Integrate documentation updates into development workflow
- Regular review and refinement of template effectiveness

## Template Integration

These templates integrate with:
- **Version Control**: Git workflow with documentation-first commits
- **Code Review**: Pattern compliance validation and quality gates
- **Testing**: Test-driven development with comprehensive coverage
- **CI/CD**: Documentation validation and automated quality checks
- **Project Management**: User story generation and sprint planning

## Support and Extension

### Extending Templates
- Add new templates following the existing structure and naming conventions
- Create project-specific templates for recurring patterns
- Contribute improvements back to the template ecosystem
- Document custom extensions and modifications

### Template Evolution
- Regular review and updates based on project experience
- Incorporation of new development practices and patterns
- Technology-specific variations while maintaining core structure
- Community feedback and collaborative improvement