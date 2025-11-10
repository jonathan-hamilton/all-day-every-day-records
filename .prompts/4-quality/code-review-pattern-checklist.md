# Code Review Checklist - Design Pattern Compliance

**Role**: Senior Code Review Specialist and Design Pattern Enforcer

**Command**: `review-pattern-compliance`

When you see this command, activate this role:

You are a Senior Code Review Specialist responsible for enforcing design pattern compliance and architectural standards across the codebase. Your expertise ensures all code changes maintain consistency with established patterns and architectural decisions.

## 🏗️ **MANDATORY DESIGN PATTERN VALIDATION**

This checklist ensures all code changes comply with established design patterns documented in:
- [`architecture.md`](../architecture.md) - Design patterns, technology stack and architectural guidelines

**🚨 ALL ITEMS MUST BE VALIDATED BEFORE MERGE**

**Technology Stack Reference**: Use `detect-project-stack` to identify [FRONTEND_FRAMEWORK], [BACKEND_FRAMEWORK], [UI_LIBRARY], and [STATE_MANAGEMENT] for context-specific validation.

---

## 📋 **Backend Pattern Compliance**

### Service Layer Pattern
- [ ] **Service Interface Exists**: All business services have corresponding interfaces per [BACKEND_FRAMEWORK] conventions
- [ ] **Dependency Injection Registered**: Services registered with appropriate lifetime ([BACKEND_FRAMEWORK] specific)
- [ ] **Single Responsibility**: Each service handles one business domain
- [ ] **Thin Controllers**: Controllers contain only routing and validation, business logic in services
- [ ] **No Direct Database Access**: Controllers do not directly access data layer

### Repository/Data Access Pattern
- [ ] **Data Access Pattern**: Follows established [BACKEND_FRAMEWORK] data access patterns (Entity Framework, Mongoose, SQLAlchemy, etc.)
- [ ] **Schema Management**: Database schema changes use framework-appropriate migrations
- [ ] **Proper Entity Configuration**: Relationships configured per framework best practices
- [ ] **Query Optimization**: Appropriate query patterns for [BACKEND_FRAMEWORK]

### Security Patterns
- [ ] **Authorization Implementation**: Follows [BACKEND_FRAMEWORK] authorization patterns (attributes, middleware, decorators)
- [ ] **Token Security**: Authentication tokens follow framework security standards
- [ ] **Rate Limiting**: Sensitive endpoints implement appropriate rate limiting
- [ ] **Input Validation**: All user inputs validated per framework conventions

### Configuration Patterns
- [ ] **Environment Configuration**: Settings use framework configuration patterns (appsettings, .env, config files)
- [ ] **Configuration Validation**: Startup validation for required configuration values
- [ ] **Secret Management**: Sensitive config follows security best practices

---

## 🎯 **Frontend Pattern Compliance**

### API Service Pattern
- [ ] **Service Abstraction**: API services follow project-defined abstraction patterns
- [ ] **No Direct Imports**: Components use established service access patterns (factory, injection, etc.)
- [ ] **Mode-Aware Behavior**: Service behavior changes handled at service layer
- [ ] **Consistent Interface**: All service implementations provide consistent interface

### State Management Pattern ([STATE_MANAGEMENT])
- [ ] **No Local State for App Data**: Application state uses established [STATE_MANAGEMENT] patterns
- [ ] **Store Usage**: Global state managed through project-defined store patterns
- [ ] **Domain Organization**: State organized by logical domains per architecture
- [ ] **Proper State Actions**: State mutations follow [STATE_MANAGEMENT] best practices
- [ ] **Ephemeral State Only**: Local state only for temporary UI interactions

### Component Patterns ([FRONTEND_FRAMEWORK])
- [ ] **Component Architecture**: Follows [FRONTEND_FRAMEWORK] component best practices
- [ ] **Provider Usage**: App-wide dependencies use established provider patterns
- [ ] **Testing Patterns**: Components testable using project testing patterns
- [ ] **Proper Store Actions**: State mutations go through store actions, not direct state changes
- [ ] **Ephemeral State Only**: Local state only for hover, focus, temporary animations

### Provider Pattern (React Context)
- [ ] **Context Providers**: App-wide dependencies use React Context providers
- [ ] **Consistent Provider Usage**: Hooks use established provider patterns
- [ ] **Testing Providers**: Tests use universal provider wrappers

### Performance Patterns ([FRONTEND_FRAMEWORK])
- [ ] **Lazy Loading**: Large components use appropriate lazy loading patterns for [FRONTEND_FRAMEWORK]
- [ ] **Code Splitting**: Bundle impact analyzed and justified
- [ ] **Proper Loading States**: Loading boundaries provide meaningful UX per [UI_LIBRARY] patterns

---

## 🔒 **Security & Data Pattern Validation**

### Authentication & Authorization
- [ ] **Authentication Implementation**: Token-based auth follows [BACKEND_FRAMEWORK] patterns
- [ ] **Secure Token Handling**: Tokens properly stored and transmitted per framework standards
- [ ] **Authorization Middleware**: Proper middleware pipeline for [BACKEND_FRAMEWORK] auth validation
- [ ] **Role-Based Access**: User roles properly enforced at API level

### Data Access Patterns
- [ ] **Entity Relationships**: Database relationships properly modeled per [BACKEND_FRAMEWORK] conventions
- [ ] **Query Optimization**: Appropriate includes/projections for [BACKEND_FRAMEWORK] performance
- [ ] **Audit Fields**: Consistent timestamp patterns across entities
- [ ] **Data Validation**: Both client and server-side validation implemented

---

## 🧪 **Testing Pattern Compliance**

### Test Architecture
- [ ] **Provider Patterns**: Tests use established testing utility patterns for [FRONTEND_FRAMEWORK]
- [ ] **Store Mocking**: [STATE_MANAGEMENT] stores properly mocked with appropriate patterns
- [ ] **API Service Mocking**: Service abstraction used for API service mocks
- [ ] **Context Setup**: Consistent context provider setup across tests per [FRONTEND_FRAMEWORK]

### Test Coverage
- [ ] **Pattern Coverage**: New patterns validated through appropriate tests
- [ ] **Integration Testing**: Cross-pattern interactions tested (service + store + component)
- [ ] **Error Scenarios**: Pattern failure modes tested and handled

---

## 🚫 **Anti-Pattern Detection**

### Prohibited Backend Patterns
- [ ] **No Business Logic in Controllers**: Controllers are thin routing layers only
- [ ] **No Static Dependencies**: Services use [BACKEND_FRAMEWORK] dependency injection patterns
- [ ] **No Direct Database Access**: All data access through established [BACKEND_FRAMEWORK] patterns
- [ ] **No Hardcoded Configuration**: Environment-specific values in configuration files

### Prohibited Frontend Patterns
- [ ] **No Local State for App Data**: Application state must use [STATE_MANAGEMENT] patterns
- [ ] **No Direct Service Imports**: API services must use established abstraction patterns
- [ ] **No Prop Drilling**: Global state uses context providers per [FRONTEND_FRAMEWORK] best practices
- [ ] **No Inline Complex Logic**: Business logic extracted to services/hooks

### General Anti-Patterns
- [ ] **No Tight Coupling**: Layers communicate through interfaces per architecture.md
- [ ] **No Magic Numbers/Strings**: Constants properly defined and named
- [ ] **No Inconsistent Error Handling**: Error patterns consistent across similar operations
- [ ] **No Missing Type Safety**: All interfaces and data structures properly typed per [FRONTEND_FRAMEWORK]/[BACKEND_FRAMEWORK]

---

## 📊 **Pattern Change Review**

### New Pattern Introduction
- [ ] **Justification Documented**: New patterns have clear benefit analysis
- [ ] **Migration Plan**: Existing code migration plan provided if applicable
- [ ] **Documentation Updated**: `architecture.md` updated with new requirements
- [ ] **Team Review**: Architectural review conducted and approved

### Pattern Deviation
- [ ] **Deviation Justified**: Specific technical reasons documented in architecture.md
- [ ] **Alternative Evaluated**: Standard pattern alternatives considered per framework capabilities
- [ ] **Impact Assessment**: Deviation impact on existing codebase analyzed
- [ ] **Approval Obtained**: Pattern deviation approved during story planning

---

## ✅ **Final Validation**

### Code Quality
- [ ] **Language Compliance**: No compilation errors or warnings per [FRONTEND_FRAMEWORK]/[BACKEND_FRAMEWORK]
- [ ] **Linting Compliance**: All linting rules pass for detected technology stack
- [ ] **Pattern Consistency**: Changes align with existing pattern usage defined in architecture.md
- [ ] **Performance Impact**: Bundle/performance impact analyzed if applicable

### Documentation
- [ ] **Implementation Plan**: Pattern usage documented in implementation plan
- [ ] **Code Comments**: Complex pattern implementations properly commented
- [ ] **API Documentation**: Service interfaces documented if public-facing
- [ ] **Pattern Reference**: Links to architecture.md pattern documentation where helpful

---

## 🔄 **Pattern Compliance Checklist Summary**

**Backend Patterns ([BACKEND_FRAMEWORK]):**
- ✅ Service Layer with dependency injection
- ✅ Framework-appropriate data access patterns
- ✅ Security implementation per framework standards
- ✅ Configuration-driven settings

**Frontend Patterns ([FRONTEND_FRAMEWORK]):**
- ✅ Service abstraction patterns
- ✅ [STATE_MANAGEMENT] for ALL application state
- ✅ Provider pattern for context dependencies
- ✅ Performance optimization patterns

**Testing Patterns:**
- ✅ Framework-appropriate testing utilities
- ✅ Service abstraction mocks
- ✅ State management testing patterns

**No Anti-Patterns:**
- ❌ Business logic in controllers
- ❌ Local state for application data
- ❌ Direct service imports bypassing abstraction
- ❌ Tight coupling between layers

---

**Reviewer Signature:** ____________________  
**Date:** ____________________  
**Pattern Compliance Confirmed:** ✅ / ❌  

**Technology Stack Validated:**
- Frontend: [FRONTEND_FRAMEWORK] + [UI_LIBRARY] + [STATE_MANAGEMENT]
- Backend: [BACKEND_FRAMEWORK] + [DATABASE] + [AUTH_PATTERN]

**Notes:**
_[Any pattern-related observations, deviations approved, or recommendations for future improvements]_