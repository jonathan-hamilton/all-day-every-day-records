# All Day Every Day Records - Design Patterns

## Overview

This document defines the architectural patterns and coding standards for All Day Every Day Records. These patterns ensure consistency, maintainability, and scalability across the React/TypeScript frontend and PHP backend.

## Frontend Patterns (React 19.0.0 + TypeScript 5.7.2)

### 1. Factory Pattern - API Services ✅ MANDATORY

**Purpose**: Centralize service creation and configuration management

**Implementation**:
```typescript
// ✅ Correct: Use factory pattern
import { createServices } from '../services';

const MyComponent: React.FC = () => {
  const services = createServices();
  const releases = await services.releases.getFeaturedReleases();
};

// ❌ Incorrect: Direct service imports
import { ReleaseService } from '../services/releaseService';
const releaseService = new ReleaseService(); // NEVER DO THIS
```

**Rules**:
- ALL API service access MUST use `createServices()` factory
- NO direct service class imports or instantiation
- Environment configuration handled automatically by factory
- Service instances created with proper dependency injection

### 2. Component Architecture Pattern ✅ MANDATORY

**Purpose**: Consistent React component structure with TypeScript safety

**Implementation**:
```typescript
// ✅ Component Structure Template
import React from 'react';
import { Box, Typography } from '@mui/material';
import type { ComponentProps } from '../types';

interface MyComponentProps {
  title: string;
  optional?: boolean;
  children?: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  optional = false, 
  children 
}) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Box>
  );
};

export default MyComponent;
```

**Rules**:
- ALL components MUST have TypeScript interface for props
- Use React.FC type annotation
- Provide default values for optional props
- Export both named and default exports
- Use Material-UI components for consistent design

### 3. State Management Pattern ✅ MANDATORY

**Purpose**: Consistent state management approach

**Local Component State**:
```typescript
// ✅ Use useState for UI state only
const [isLoading, setIsLoading] = useState(false);
const [currentSlide, setCurrentSlide] = useState(0);
const [isHovered, setIsHovered] = useState(false);
```

**Application State**:
```typescript
// ✅ For future global state (when needed)
// Use established patterns like Context API or state management library
// Currently: Local state is sufficient for Sprint 2 components
```

**Rules**:
- Use `useState` for component-specific UI state
- Use `useEffect` for side effects and lifecycle management
- Keep state as local as possible
- Lift state up only when components need to share state

### 4. API Integration Pattern ✅ MANDATORY

**Purpose**: Type-safe API communication with error handling

**Implementation**:
```typescript
// ✅ API Integration Template
import { useState, useEffect } from 'react';
import { createServices } from '../services';
import type { ReleaseOverview } from '../types';

export const useReleaseData = () => {
  const [releases, setReleases] = useState<ReleaseOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        const services = createServices();
        const data = await services.releases.getFeaturedReleases();
        setReleases(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  return { releases, loading, error };
};
```

**Rules**:
- ALWAYS use factory pattern for service creation
- Implement loading, success, and error states
- Use TypeScript interfaces for API response types
- Handle errors gracefully with user-friendly messages

### 5. Responsive Design Pattern ✅ MANDATORY

**Purpose**: Mobile-first responsive design using Material-UI breakpoints

**Implementation**:
```typescript
// ✅ Responsive Design Template
import { Box, useTheme, useMediaQuery } from '@mui/material';

export const ResponsiveComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'flex' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 4 },
        padding: { xs: 2, sm: 3, md: 4 },
        height: { xs: 'auto', md: 400 }
      }}
    >
      {/* Component content */}
    </Box>
  );
};
```

**Rules**:
- Use MUI breakpoint system: xs (mobile), sm (tablet), md (desktop)
- Implement mobile-first design approach
- Use `useMediaQuery` for JavaScript responsive logic
- Test across all breakpoints

### 6. Error Handling Pattern ✅ MANDATORY

**Purpose**: Consistent error handling and user feedback

**Implementation**:
```typescript
// ✅ Error Handling Template
import { Alert, Box, Button } from '@mui/material';

interface ErrorBoundaryProps {
  error: string | null;
  onRetry?: () => void;
  fallback?: React.ReactNode;
}

export const ErrorDisplay: React.FC<ErrorBoundaryProps> = ({ 
  error, 
  onRetry, 
  fallback 
}) => {
  if (!error) return null;

  return (
    <Box sx={{ my: 2 }}>
      <Alert 
        severity="error" 
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      >
        {error}
      </Alert>
      {fallback}
    </Box>
  );
};
```

**Rules**:
- Provide user-friendly error messages
- Include retry mechanisms where appropriate
- Use Material-UI Alert component for consistency
- Implement graceful fallbacks for missing content

## Backend Patterns (PHP)

### 1. Endpoint Pattern ✅ MANDATORY

**Purpose**: Simple, direct endpoint implementation (Nickel & Dime style)

**Implementation**:
```php
<?php
// ✅ Endpoint Structure Template
require_once 'security.php';
require_once 'database.php';
require_once 'config.php';

// Handle CORS and authentication
handleCORS();

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
    exit;
}

try {
    $db = new Database();
    
    // Business logic here
    $results = $db->query("SELECT * FROM releases WHERE is_featured = 1 LIMIT 8");
    
    jsonResponse($results);
    
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    jsonResponse(['error' => 'Internal server error'], 500);
}
?>
```

**Rules**:
- Each endpoint is a separate PHP file
- Use helper functions from security.php
- Implement proper error handling and logging
- Return consistent JSON response format

### 2. Database Access Pattern ✅ MANDATORY

**Purpose**: Simple database connection and query execution

**Implementation**:
```php
// ✅ Database Usage Template
$db = new Database();

// Simple query
$releases = $db->query("SELECT * FROM releases WHERE status = 'published'");

// Parameterized query
$release = $db->queryOne(
    "SELECT * FROM releases WHERE id = :id", 
    ['id' => $releaseId]
);

// Execute non-SELECT query
$db->execute(
    "UPDATE releases SET view_count = view_count + 1 WHERE id = :id",
    ['id' => $releaseId]
);
```

**Rules**:
- Use Database class for all database operations
- Always use parameterized queries for user input
- Handle database errors appropriately
- Keep queries simple and readable

### 3. Security Pattern ✅ MANDATORY

**Purpose**: Consistent security implementation across endpoints

**Implementation**:
```php
// ✅ Security Implementation Template
require_once 'security.php';

// CORS handling (required for all endpoints)
handleCORS();

// Input validation
$input = validateInput($_GET, ['id' => 'int', 'limit' => 'int']);

// Authentication (when required)
if (requiresAuth($endpoint)) {
    $user = requireAuth();
}

// Authorization (when required)
if (!hasPermission($user, $action)) {
    jsonResponse(['error' => 'Insufficient permissions'], 403);
    exit;
}
```

**Rules**:
- ALWAYS call handleCORS() at the beginning of endpoints
- Validate and sanitize all input
- Use helper functions for common security operations
- Implement proper HTTP status codes

## Integration Patterns

### 1. Frontend-Backend Communication ✅ MANDATORY

**Purpose**: Consistent API communication patterns

**Frontend Side**:
```typescript
// ✅ API Service Implementation
export class ReleaseService {
  constructor(private readonly apiService: ApiService) {}

  async getFeaturedReleases(limit = 8): Promise<ReleaseOverview[]> {
    try {
      const releases = await this.apiService.get<ReleaseOverview[]>(
        `/get-releases.php?featured=true&limit=${limit}`
      );
      return Array.isArray(releases) ? releases : [];
    } catch (error) {
      console.error('Error fetching featured releases:', error);
      return [];
    }
  }
}
```

**Backend Side**:
```php
// get-releases.php
$featured = isset($_GET['featured']) && $_GET['featured'] === 'true';
$limit = min(max(1, intval($_GET['limit'] ?? 10)), 50);

$query = "SELECT * FROM releases WHERE status = 'published'";
if ($featured) {
    $query .= " AND is_featured = 1";
}
$query .= " ORDER BY display_order ASC LIMIT :limit";

$releases = $db->query($query, ['limit' => $limit]);
jsonResponse($releases);
```

**Rules**:
- Use existing API service layer on frontend
- Return arrays directly from backend (not wrapped in response objects)
- Implement proper error handling on both sides
- Use consistent parameter naming and validation

### 2. Type Safety Pattern ✅ MANDATORY

**Purpose**: End-to-end type safety from database to UI

**Implementation**:
```typescript
// ✅ Type Definition Template
export interface ReleaseOverview {
  id: number;
  title: string;
  slug: string;
  cover_image_url?: string;
  release_date?: string;
  release_type: ReleaseType;
  is_featured: boolean;
  display_order: number;
  label_name?: string;
  artists_with_roles?: string;
}

// Component usage
interface CarouselProps {
  releases: ReleaseOverview[];
  maxSlides?: number;
}
```

**Rules**:
- Define TypeScript interfaces for all API responses
- Use optional properties for nullable database fields
- Keep interface names descriptive and consistent
- Import types using `type` imports when possible

## Anti-Patterns ❌ FORBIDDEN

### Frontend Anti-Patterns
- ❌ Direct service class instantiation (bypassing factory)
- ❌ Inline styles instead of Material-UI sx prop
- ❌ Any types instead of proper TypeScript interfaces
- ❌ Direct DOM manipulation instead of React patterns
- ❌ Props drilling instead of appropriate state lifting

### Backend Anti-Patterns
- ❌ Complex routing systems for simple endpoints
- ❌ ORM or heavy frameworks for basic operations
- ❌ SQL injection vulnerable queries
- ❌ Inconsistent error response formats
- ❌ Missing CORS handling

### Integration Anti-Patterns
- ❌ Hardcoded API URLs in components
- ❌ Synchronous API calls blocking UI
- ❌ Missing error handling for API failures
- ❌ Inconsistent response formats between endpoints
- ❌ Client-side business logic that should be on server

## Pattern Compliance Validation

### Code Review Checklist

**Frontend Components:**
- [ ] Uses factory pattern for API services (`createServices()`)
- [ ] Has TypeScript interface for props
- [ ] Implements responsive design with MUI breakpoints
- [ ] Handles loading and error states appropriately
- [ ] Uses Material-UI components consistently

**Backend Endpoints:**
- [ ] Calls `handleCORS()` at beginning
- [ ] Validates input parameters
- [ ] Uses parameterized queries
- [ ] Returns consistent JSON responses
- [ ] Implements proper error handling

**API Integration:**
- [ ] Frontend uses existing service layer
- [ ] Type-safe API responses
- [ ] Consistent parameter naming
- [ ] Proper error handling on both sides
- [ ] No hardcoded URLs or configuration

## Evolution Guidelines

### Adding New Patterns
1. Document pattern purpose and implementation
2. Provide code examples for correct usage
3. Update this document with new pattern
4. Add to code review checklist

### Pattern Updates
1. Update existing implementations gradually
2. Maintain backward compatibility during transitions
3. Document migration path for breaking changes
4. Update examples and anti-patterns accordingly

---

*This document serves as the authoritative guide for maintaining consistent architectural patterns across All Day Every Day Records. All implementations must comply with these patterns to ensure code quality and maintainability.*