# [Project Name] - Documentation Map

## Documentation Structure Overview

This documentation follows a structured approach to capture all aspects of the project lifecycle. Each document serves a specific purpose and connects to others in a logical flow.

---

## Core Documentation Files

### Project Foundation
- **vision.md** - Project purpose, mission statement, success criteria, and long-term goals
- **architecture.md** - System design, technology stack, design patterns, and development guidelines

### Requirements & Planning
- **requirements.md** - Detailed functional and non-functional requirements with acceptance criteria
- **requirements-roadmap.md** - Prioritized development phases, milestones, and delivery timeline

### Implementation Documentation
- **user-stories/[sprint-name].md** - Sprint-specific user stories with acceptance criteria and implementation notes
- **implementation/[feature-name].md** - Detailed implementation plans for specific features or stories

### Quality Assurance
- **testing/api-tests.md** - API testing strategy, test cases, and validation approaches
- **testing/frontend-tests.md** - Frontend testing strategy including unit, integration, and E2E tests
- **testing/test-results/[date].md** - Test execution results and quality metrics

### Development Process
- **sprints/[sprint-name]/** - Sprint planning, retrospectives, and deliverables
- **implementation/patterns-compliance.md** - Design pattern compliance validation and review notes

---

## Document Relationships

### Primary Flow
1. **vision.md** → **architecture.md** (Establishes foundation)
2. **architecture.md** → **requirements.md** (Defines technical approach)
3. **requirements.md** → **requirements-roadmap.md** (Creates delivery plan)
4. **requirements-roadmap.md** → **user-stories/[sprint].md** (Breaks down into actionable items)
5. **user-stories/[sprint].md** → **implementation/[feature].md** (Creates implementation plans)
6. **implementation/[feature].md** → **testing/[test-type].md** (Validates implementation)

### Cross-References
- **architecture.md** patterns referenced in **implementation/patterns-compliance.md**
- **requirements.md** acceptance criteria validated in **testing/[test-type].md**
- **user-stories/[sprint].md** link back to **requirements-roadmap.md** priorities
- **implementation/[feature].md** references **architecture.md** design patterns

---

## Documentation Maintenance

### Update Triggers
- **Code Changes**: Update relevant implementation and testing documentation
- **Requirement Changes**: Update requirements.md and cascade to dependent documents
- **Architecture Changes**: Update architecture.md and validate pattern compliance
- **Sprint Completion**: Update roadmap progress and create sprint retrospectives

### Review Cycles
- **Weekly**: Review and update current sprint documentation
- **Monthly**: Review architecture and requirements alignment
- **Quarterly**: Review vision alignment and strategic direction
- **Release**: Comprehensive documentation review and updates

### Quality Checks
- **Consistency**: Ensure terminology and approach consistency across documents
- **Completeness**: Verify all requirements have corresponding implementation and tests
- **Accuracy**: Validate documentation reflects current system state
- **Accessibility**: Ensure documentation is discoverable and navigable

---

## Document Templates

### Template Usage
All documentation follows established templates to ensure:
- **Consistency**: Uniform structure and format across all documents
- **Completeness**: Required sections and information captured
- **Quality**: Standard level of detail and clarity
- **Maintainability**: Easy to update and extend

### Template Locations
- **docs/templates/**: Contains all document templates
- **prompts/templates/**: Contains AI prompt templates for generating documentation
- **examples/**: Contains example implementations of each template

---

## Navigation Guidelines

### Quick Start
1. Read **vision.md** for project overview
2. Review **architecture.md** for technical foundation
3. Check **requirements-roadmap.md** for current status
4. Explore **user-stories/[current-sprint].md** for active work

### Deep Dive
1. Start with **requirements.md** for detailed specifications
2. Review **implementation/[feature].md** for technical details
3. Check **testing/[test-type].md** for validation approach
4. Reference **architecture.md** for pattern compliance

### Maintenance Mode
1. Use **implementation/patterns-compliance.md** for code review
2. Update **testing/test-results/[date].md** with new results
3. Maintain **sprints/[sprint-name]/retrospective.md** for improvements
4. Keep **requirements-roadmap.md** current with progress updates