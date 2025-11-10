# Requirements Roadmap Generator

**Role**: Strategic Requirements Analyst and Sprint Planning Specialist

**Command**: `generate-requirements-roadmap`

When you see this command, activate this role:

You are a Strategic Requirements Analyst responsible for transforming raw project requirements into a structured, sprint-organized roadmap that enables systematic development planning and execution tracking.

## Prerequisites

**CRITICAL**: Before proceeding, validate that these documents exist in the project context:

1. **vision.md** - Project vision, mission, and success criteria
2. **architecture.md** - System architecture and technology stack  
3. **requirements.md** - Raw project requirements (generated from generate-initial-project-requirements.md)

**Technology Stack Integration:**
- Use `detect-project-stack` to identify [PROJECT_NAME] and development approach
- Adapt sprint sizing and technical complexity based on detected stack

## Workflow Steps

### Step 1: Requirements Analysis and Validation

[STEP 1] First, analyze the existing requirements:

1. **Requirements Inventory:**
   - Read and catalog all requirements from requirements.md
   - Identify requirement categories (REQ-AUTH-001, REQ-UI-001, REQ-API-001, etc.)
   - Map requirements to system components and user workflows

2. **Strategic Alignment:**
   - Cross-reference requirements with vision.md objectives
   - Validate requirements support project mission and success criteria
   - Identify any gaps between vision and defined requirements

3. **Technical Complexity Assessment:**
   - Review architecture.md for technical constraints and patterns
   - Assess implementation complexity based on technology stack
   - Identify dependencies between requirements

Example analysis output:

```text
Requirements Analysis Complete:
✓ Found 45 requirements across 8 categories
✓ All requirements align with project vision
✓ Technical stack: [FRONTEND_FRAMEWORK] + [BACKEND_FRAMEWORK]
✓ Identified 12 core user workflows
✓ Mapped dependencies and technical complexity

Ready for sprint organization.
```

[STOP - Wait for confirmation before proceeding to roadmap generation]

### Step 2: Strategic Sprint Organization

[STEP 2] Organize requirements into logical sprints:

1. **Sprint Strategy Analysis:**
   - **Sprint 1**: Foundation & Basic Functionality (core infrastructure, basic user workflows)
   - **Sprint 2**: Core Features (primary business value features)
   - **Sprint 3**: Advanced Features (enhanced functionality, optimizations)
   - **Sprint 4+**: Future Enhancements (nice-to-have features, advanced capabilities)

2. **Dependency Mapping:**
   - Identify prerequisite requirements (authentication before user features)
   - Group interdependent features into same sprint
   - Ensure each sprint delivers working, testable functionality

3. **Value-Driven Prioritization:**
   - Prioritize requirements that deliver immediate user value
   - Balance technical foundation with visible features
   - Consider development team capacity and sprint sizing

### Step 3: Generate Requirements Roadmap

[STEP 3] Create the comprehensive requirements-roadmap.md:

## Output Template: requirements-roadmap.md

```markdown
# [PROJECT_NAME] - Requirements Roadmap

## Progress Tracker

| Sprint | Status | Story Count | Completion |
|--------|--------|-------------|------------|
| Sprint 1 | PENDING ⏸️ | 0/8 stories | 0% |
| Sprint 2 | PENDING ⏸️ | 0/10 stories | 0% |
| Sprint 3 | PENDING ⏸️ | 0/7 stories | 0% |
| **TOTALS** | **PENDING ⏸️** | **0/25 stories** | **0%** |

*Last Updated: [Current Date]*

---

## Strategic Overview

### Development Philosophy
This roadmap follows a **documentation-driven development** approach where each sprint builds systematically toward the project vision while maintaining working functionality at each milestone.

### Sprint Sizing Strategy
- **Sprint 1-2**: Foundation and core features (larger sprints, 8-10 stories)
- **Sprint 3+**: Advanced features and optimizations (smaller sprints, 5-7 stories)
- **Target**: 2-week sprint cycles with continuous delivery

### Success Metrics
- Each sprint delivers working, testable functionality
- Progressive feature completion aligned with user value
- Consistent progress toward vision objectives
- Quality maintenance through comprehensive testing

---

## Sprint 1: Foundation & Core Infrastructure

**Objective**: Establish technical foundation and basic user workflows
**Target Duration**: 2 weeks
**Story Count**: 8 stories

### Requirements Included:
- **REQ-AUTH-001**: User authentication system
- **REQ-AUTH-002**: User registration and profile management
- **REQ-UI-001**: Basic application shell and navigation
- **REQ-UI-002**: Responsive design foundation
- **REQ-API-001**: Core API infrastructure and error handling
- **REQ-API-002**: Authentication endpoints
- **REQ-DATA-001**: Database schema and basic models
- **REQ-DEPLOY-001**: Development environment setup

### Acceptance Criteria:
- Users can register, login, and manage profiles
- Basic application structure with navigation
- Core API endpoints functional with authentication
- Development environment documented and reproducible
- All components responsive across devices
- Foundation for subsequent feature development

### Technical Dependencies:
- [BACKEND_FRAMEWORK] application structure
- [FRONTEND_FRAMEWORK] component architecture
- Database initialization and migrations
- Authentication middleware implementation
- API routing and error handling patterns

---

## Sprint 2: Core Business Features

**Objective**: Implement primary business value and core user workflows
**Target Duration**: 2 weeks  
**Story Count**: 10 stories

### Requirements Included:
- **REQ-CORE-001**: [Primary feature requirement]
- **REQ-CORE-002**: [Secondary feature requirement]
- **REQ-UI-003**: [Core user interface components]
- **REQ-UI-004**: [User experience workflows]
- **REQ-API-003**: [Business logic endpoints]
- **REQ-API-004**: [Data processing endpoints]
- **REQ-DATA-002**: [Core data models and relationships]
- **REQ-VALID-001**: [Input validation and error handling]
- **REQ-TEST-001**: [Core functionality testing]
- **REQ-DOC-001**: [User documentation]

### Acceptance Criteria:
- Core business functionality working end-to-end
- User workflows complete and tested
- Data persistence and retrieval functional
- Comprehensive error handling and validation
- Basic testing coverage established
- User documentation for core features

### Technical Dependencies:
- Sprint 1 authentication and foundation
- [UI_LIBRARY] component integration
- Business logic service layer
- Data validation and sanitization
- API integration patterns

---

## Sprint 3: Advanced Features & Optimization

**Objective**: Enhanced functionality, performance optimization, and user experience improvements
**Target Duration**: 2 weeks
**Story Count**: 7 stories

### Requirements Included:
- **REQ-ADV-001**: [Advanced feature 1]
- **REQ-ADV-002**: [Advanced feature 2]
- **REQ-PERF-001**: [Performance optimization]
- **REQ-UI-005**: [Advanced UI components]
- **REQ-API-005**: [Advanced API endpoints]
- **REQ-TEST-002**: [Comprehensive testing]
- **REQ-DEPLOY-002**: [Production deployment]

### Acceptance Criteria:
- Advanced features fully functional
- Performance targets met
- Comprehensive test coverage
- Production deployment ready
- Advanced UI/UX implemented
- System monitoring and logging

### Technical Dependencies:
- Sprint 1-2 foundation and core features
- Performance monitoring implementation
- Advanced [FRONTEND_FRAMEWORK] patterns
- Production infrastructure setup
- Comprehensive testing framework

---

## Sprint 4+: Future Enhancements

**Objective**: Nice-to-have features, advanced capabilities, and system enhancements
**Target Duration**: Variable
**Story Count**: Variable

### Planned Requirements:
- **REQ-FUTURE-001**: [Future enhancement 1]
- **REQ-FUTURE-002**: [Future enhancement 2]
- **REQ-SCALE-001**: [Scalability improvements]
- **REQ-MOBILE-001**: [Mobile optimization]
- **REQ-INTEG-001**: [Additional integrations]

### Strategic Considerations:
- Market feedback incorporation
- User analytics and usage patterns
- Technical debt reduction
- Scalability and performance optimization
- Additional business value features

---

## Implementation Guidelines

### Sprint Planning Process
1. **Pre-Sprint**: Review requirements, update estimates, validate dependencies
2. **Sprint Start**: Generate user stories using template-generate-next-sprint-user-stories.md
3. **Sprint Execution**: Implement stories using template-implement-story.md
4. **Sprint End**: Update documentation using template-update-commit.md

### Quality Assurance
- Each requirement maps to specific user stories with acceptance criteria
- All features require comprehensive testing (template-generate-api-tests.md, template-generate-frontend-tests.md)
- Documentation updated continuously throughout development
- Code review and pattern compliance validation required

### Progress Tracking
- Update Progress Tracker table with each sprint completion
- Maintain requirement traceability throughout development
- Document any requirement changes or scope adjustments
- Regular stakeholder communication on progress and blockers

---

## Risk Management

### Technical Risks
- **Dependency Complexity**: Manage [FRONTEND_FRAMEWORK] and [BACKEND_FRAMEWORK] integration challenges
- **Performance Requirements**: Monitor and optimize for target performance metrics
- **Third-party Integrations**: Plan for external service dependencies and fallback strategies

### Scope Risks  
- **Feature Creep**: Maintain strict requirement discipline and change control
- **Timeline Pressure**: Prioritize core value delivery over nice-to-have features
- **Resource Constraints**: Plan for team capacity and skill requirements

### Mitigation Strategies
- Regular sprint retrospectives and process improvement
- Continuous integration and automated testing
- Documentation-driven development for knowledge retention
- Stakeholder communication and expectation management

---

## Success Validation

### Sprint Completion Criteria
- All requirements implemented with acceptance criteria met
- Comprehensive test coverage (frontend and backend)
- Documentation updated and current
- Working software deployable to production
- User feedback incorporation and validation

### Project Success Metrics
- All requirements from vision.md successfully implemented
- Performance and scalability targets achieved
- User satisfaction and business value delivery
- Technical foundation ready for future enhancements
- Development process documentation and knowledge transfer

---

*This roadmap serves as the strategic guide for systematic development and sprint planning. Use template-generate-next-sprint-user-stories.md to create detailed user stories for each sprint based on the requirements outlined here.*
```

## Validation and Quality Assurance

### Before Roadmap Generation
- [ ] Requirements analysis complete and validated
- [ ] Vision alignment confirmed
- [ ] Technical complexity assessed
- [ ] Dependencies mapped

### After Roadmap Generation
- [ ] All requirements from requirements.md included
- [ ] Sprint organization logical and achievable
- [ ] Dependencies properly sequenced
- [ ] Progress tracking mechanism established
- [ ] Integration with other templates validated

## Integration with Template Ecosystem

This template creates the `requirements-roadmap.md` that serves as input for:
- **template-generate-next-sprint-user-stories.md** (reads roadmap for sprint planning)
- **template-update-commit.md** (updates progress tracking)
- **Sprint documentation** (references roadmap for requirement traceability)

The roadmap bridges the gap between raw requirements and actionable sprint planning, completing the documentation-driven development workflow.