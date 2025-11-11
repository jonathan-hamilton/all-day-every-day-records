# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# All Day Every Day Records - Frontend

React TypeScript frontend application for the All Day Every Day Records website.

## Technology Stack

- **React 19.0.0**: Latest React with concurrent features
- **TypeScript 5.7.2**: Type safety and enhanced development experience  
- **Vite 6.3.1**: Fast development server and optimized builds
- **Material-UI 7.0.2**: Modern component library with custom rap-themed styling
- **React Router 7.5.1**: Client-side routing with nested layouts
- **ESLint 9.22.0**: Code quality and consistency enforcement

## Quick Start

### Prerequisites
- Node.js (Latest LTS version)
- npm package manager

### Environment Setup

1. **Copy environment configuration:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure environment variables:**
   Edit `.env.local` for your local setup:
   ```bash
   # For local development
   NODE_ENV=local
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_DEV_TOOLS=true
   VITE_THEME_DEBUG=true
   ```

   For production deployment, update:
   ```bash
   # For production
   NODE_ENV=production  
   VITE_API_BASE_URL=https://api.alldayeverydayrecords.com/api
   VITE_DEV_TOOLS=false
   VITE_THEME_DEBUG=false
   VITE_SOURCEMAPS=false
   ```

### Installation and Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173`

3. **Other available scripts:**
   ```bash
   npm run build    # Create production build
   npm run preview  # Preview production build locally  
   npm run lint     # Run ESLint code quality checks
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route-level page components  
├── layouts/       # Layout wrapper components
├── styles/        # Global styles and MUI theme
├── types/         # TypeScript type definitions
├── utils/         # Utility functions and helpers
├── services/      # API services and external integrations
├── hooks/         # Custom React hooks
└── assets/        # Static assets (images, icons, etc.)
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the frontend application.

### Required Variables:
- `NODE_ENV`: Environment type (local or production)
- `VITE_APP_NAME`: Application display name
- `VITE_API_BASE_URL`: Backend API base URL

### Optional Variables:
- `VITE_PORT`: Development server port (default: 5173)
- `VITE_DEV_TOOLS`: Enable development features
- `VITE_THEME_DEBUG`: Enable theme debugging tools
- `VITE_SOURCEMAPS`: Enable source maps in builds

### External Service Variables (Future):
- `VITE_SPOTIFY_CLIENT_ID`: Spotify integration
- `VITE_APPLE_MUSIC_KEY`: Apple Music integration  
- `VITE_YOUTUBE_API_KEY`: YouTube integration

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration enforces React and TypeScript best practices
- Functional components with hooks pattern
- Material-UI sx prop for styling

### Component Organization  
- Use barrel exports (`index.ts`) for clean imports
- Separate concerns: pages, layouts, reusable components
- Follow Material-UI theming patterns
- Implement responsive design with MUI breakpoints

### State Management
- Local `useState` for component-specific UI state
- Zustand stores for application state (future implementation)
- React Context for theme and global providers

## Build and Deployment

### Production Build
```bash
npm run build
```
Creates optimized production build in `dist/` directory.

### Build Verification
```bash
npm run preview
```
Serves production build locally for testing.

### Environment-Specific Builds
Ensure proper environment variables are set before building:
- Set `NODE_ENV=production` for production builds
- Update API URLs for target environment
- Disable development features in production

## Troubleshooting

### Development Server Issues
- If port 5173 is in use, Vite will automatically try another port
- Check console for environment variable loading issues
- Verify `.env.local` file exists and variables are prefixed with `VITE_`

### Build Issues
- Ensure all TypeScript errors are resolved
- Check that production environment variables are set correctly
- Verify all imports use correct paths and barrel exports

### Styling Issues
- Material-UI theme is configured in `src/styles/theme.ts`
- Global styles use MUI's `CssBaseline` component
- Custom theme debugging available with `VITE_THEME_DEBUG=true`

## Contributing

1. Follow existing code organization patterns
2. Use TypeScript for all new code with proper typing
3. Implement responsive design using Material-UI breakpoints  
4. Test all changes in both local and production environment configurations
5. Update environment variables documentation when adding new variables

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
