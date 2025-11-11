# Component Organization Guidelines

## Overview

This document outlines the component organization patterns and best practices for the All Day Every Day Records frontend application. These guidelines ensure consistency, maintainability, and scalability across the codebase.

## Directory Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   ├── layout/          # Layout-specific components
│   ├── forms/           # Form-related components
│   └── common/          # Shared utility components
├── layouts/             # Page layout wrappers
├── pages/               # Route-level page components
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── services/            # API and external service integrations
├── styles/              # Global styles, themes, and style utilities
├── types/               # TypeScript type definitions
└── utils/               # Utility functions and helpers
```

## Component Categories

### 1. Page Components (`pages/`)
- **Purpose**: Top-level route components that represent entire pages
- **Naming**: PascalCase, descriptive of the page purpose
- **Examples**: `Home.tsx`, `Releases.tsx`, `ReleaseDetail.tsx`
- **Responsibilities**:
  - Fetch and manage page-level data
  - Compose layout and child components
  - Handle route parameters and navigation
  - Manage page-specific state

**Example Structure:**
```typescript
// pages/Releases.tsx
import { useState, useEffect } from 'react'
import { Container, Typography } from '@mui/material'
import { ReleaseFilters, ReleasesGrid } from '../components'
import { useReleases } from '../hooks'

export const Releases = () => {
  // Page-level state and logic
  // Component composition
  // Return JSX
}
```

### 2. Layout Components (`layouts/`)
- **Purpose**: Structural components that define page layouts
- **Naming**: PascalCase ending with "Layout"
- **Examples**: `MainLayout.tsx`, `AuthLayout.tsx`
- **Responsibilities**:
  - Provide consistent page structure
  - Handle navigation and header/footer
  - Manage layout-specific responsive behavior

### 3. Reusable Components (`components/`)

#### UI Components (`components/ui/`)
- **Purpose**: Basic, reusable UI building blocks
- **Examples**: `Button.tsx`, `Input.tsx`, `Modal.tsx`
- **Characteristics**:
  - Highly reusable and composable
  - Accept props for customization
  - Minimal business logic
  - Well-typed interfaces

#### Feature Components (`components/`)
- **Purpose**: Business logic components specific to application features
- **Examples**: `ReleaseFilters.tsx`, `ReleasesGrid.tsx`, `StreamingIconRow.tsx`
- **Characteristics**:
  - Encapsulate specific functionality
  - May connect to context or services
  - Reusable within feature domain

## Component Design Principles

### 1. Single Responsibility
Each component should have a single, well-defined responsibility:
```typescript
// Good: Focused responsibility
export const ReleaseFilters = ({ onFilterChange }: Props) => {
  // Only handles filter UI and events
}

// Avoid: Multiple responsibilities
export const ReleasesPageWithFiltersAndGrid = () => {
  // Handles too many concerns
}
```

### 2. Composition over Inheritance
Favor component composition for flexibility:
```typescript
// Good: Composable design
export const ReleasePage = () => (
  <MainLayout>
    <ReleaseFilters onFilterChange={handleFilter} />
    <ReleasesGrid releases={filteredReleases} />
  </MainLayout>
)

// Avoid: Monolithic components
export const ReleasePage = () => {
  // All functionality in one component
}
```

### 3. Props Interface Design
Define clear, well-typed props interfaces:
```typescript
interface ReleaseCardProps {
  release: Release
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  variant?: 'compact' | 'detailed'
  className?: string
}

export const ReleaseCard = ({
  release,
  onEdit,
  onDelete,
  variant = 'compact',
  className
}: ReleaseCardProps) => {
  // Component implementation
}
```

## File Naming Conventions

### Component Files
- **Format**: PascalCase.tsx
- **Examples**: `ReleaseCard.tsx`, `NavigationDrawer.tsx`
- **Rule**: Match the component name exactly

### Index Files
Use index files for clean imports:
```typescript
// components/index.ts
export { ReleaseCard } from './ReleaseCard'
export { ReleaseFilters } from './ReleaseFilters'
export { ReleasesGrid } from './ReleasesGrid'

// Usage
import { ReleaseCard, ReleaseFilters } from '../components'
```

### Style Files (if using CSS modules)
- **Format**: ComponentName.module.css
- **Example**: `ReleaseCard.module.css`

## Component Structure Template

```typescript
// Import dependencies
import { useState, useEffect } from 'react'
import { Typography, Box, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Import types
import type { Release } from '../../types'

// Import custom hooks/services
import { useReleases } from '../../hooks'

// Import child components
import { ReleaseCard } from './ReleaseCard'

// Props interface
interface ReleasesGridProps {
  releases: Release[]
  onReleaseSelect?: (release: Release) => void
  loading?: boolean
}

// Component implementation
export const ReleasesGrid = ({
  releases,
  onReleaseSelect,
  loading = false
}: ReleasesGridProps) => {
  // Hooks
  const theme = useTheme()

  // State
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Effects
  useEffect(() => {
    // Side effects
  }, [])

  // Event handlers
  const handleReleaseClick = (release: Release) => {
    setSelectedId(release.id)
    onReleaseSelect?.(release)
  }

  // Conditional rendering
  if (loading) {
    return <Typography>Loading releases...</Typography>
  }

  // Main render
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: theme.spacing(2),
        padding: theme.spacing(2)
      }}
    >
      {releases.map((release) => (
        <ReleaseCard
          key={release.id}
          release={release}
          selected={selectedId === release.id}
          onClick={() => handleReleaseClick(release)}
        />
      ))}
    </Box>
  )
}

// Default export (optional, prefer named exports)
export default ReleasesGrid
```

## State Management Guidelines

### 1. Component State
Use local state for component-specific data:
```typescript
const [isOpen, setIsOpen] = useState(false)
const [formData, setFormData] = useState<FormData>(initialData)
```

### 2. Context for Shared State
Use React Context for state shared across multiple components:
```typescript
// context/ReleaseContext.tsx
export const ReleaseContext = createContext<ReleaseContextType | null>(null)

export const useReleaseContext = () => {
  const context = useContext(ReleaseContext)
  if (!context) {
    throw new Error('useReleaseContext must be used within ReleaseProvider')
  }
  return context
}
```

### 3. Custom Hooks for Logic
Extract reusable logic into custom hooks:
```typescript
// hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}
```

## Testing Guidelines

### Component Testing Structure
```typescript
// __tests__/ReleaseCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { rapTheme } from '../../styles'
import { ReleaseCard } from '../ReleaseCard'

const mockRelease: Release = {
  id: '1',
  title: 'Test Album',
  artist: 'Test Artist',
  // ... other properties
}

const renderWithTheme = (component: React.ReactElement) =>
  render(<ThemeProvider theme={rapTheme}>{component}</ThemeProvider>)

describe('ReleaseCard', () => {
  it('renders release information correctly', () => {
    renderWithTheme(<ReleaseCard release={mockRelease} />)
    
    expect(screen.getByText('Test Album')).toBeInTheDocument()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn()
    renderWithTheme(<ReleaseCard release={mockRelease} onEdit={mockOnEdit} />)
    
    fireEvent.click(screen.getByTestId('edit-button'))
    expect(mockOnEdit).toHaveBeenCalledWith('1')
  })
})
```

## Performance Considerations

### 1. Memoization
Use React.memo for expensive renders:
```typescript
export const ReleaseCard = React.memo(({ release, onEdit }: Props) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.release.id === nextProps.release.id
})
```

### 2. Callback Optimization
Memoize callbacks to prevent unnecessary re-renders:
```typescript
const handleReleaseEdit = useCallback((id: string) => {
  // Edit logic
}, [/* dependencies */])
```

### 3. Lazy Loading
Use React.lazy for code splitting:
```typescript
const ReleaseDetail = lazy(() => import('./pages/ReleaseDetail'))

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ReleaseDetail />
</Suspense>
```

## Error Boundaries

Implement error boundaries for graceful error handling:
```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}
```

## Best Practices Summary

1. **Keep components focused** on a single responsibility
2. **Use TypeScript interfaces** for all props and data structures
3. **Implement proper error handling** with boundaries and validation
4. **Write tests** for component behavior and edge cases
5. **Optimize performance** with memoization and code splitting
6. **Follow naming conventions** consistently across the codebase
7. **Document complex components** with JSDoc comments
8. **Use composition patterns** for flexible, reusable components
9. **Implement accessibility** features from the start
10. **Keep styles co-located** with components when using CSS modules

## Migration Notes

When refactoring existing components to follow these guidelines:

1. **Identify component responsibilities** and split if necessary
2. **Add TypeScript interfaces** for props and internal types
3. **Extract reusable logic** into custom hooks
4. **Implement error boundaries** around feature areas
5. **Add unit tests** for critical component functionality
6. **Update imports/exports** to use barrel files
7. **Validate accessibility** and performance impacts

This organization system provides a scalable foundation for the All Day Every Day Records application while maintaining code quality and developer experience.