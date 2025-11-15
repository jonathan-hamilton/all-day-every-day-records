import { createTheme } from '@mui/material/styles'

// Custom color palette for rap-themed aesthetic
const colors = {
  // Primary - Deep urban blues and grays
  primary: {
    main: '#212121', // Charcoal black
    light: '#484848', // Dark gray
    dark: '#000000', // Pure black
    contrastText: '#ffffff',
  },
  // Secondary - Bold accent colors
  secondary: {
    main: '#ff6b35', // Vibrant orange-red
    light: '#ff9a66',
    dark: '#c73e02',
    contrastText: '#ffffff',
  },
  // Background colors
  background: {
    default: '#fafafa', // Light gray for main background
    paper: '#ffffff', // White for cards/surfaces
  },
  // Text colors
  text: {
    primary: '#212121', // Dark text on light backgrounds
    secondary: '#757575', // Gray text for secondary content
  },
  // Additional theme colors
  error: {
    main: '#d32f2f',
  },
  warning: {
    main: '#f57c00',
  },
  success: {
    main: '#388e3c',
  },
  // Custom rap-theme colors
  custom: {
    gold: '#ffd700', // Gold accent
    silver: '#c0c0c0', // Silver accent
    neonGreen: '#39ff14', // Neon green for highlights
    darkRed: '#8b0000', // Dark red for emphasis
  }
}

// Typography configuration with bold, street-style fonts
const typography = {
  fontFamily: [
    'Arial Black',
    'Impact',
    'Helvetica Neue', 
    'Arial',
    'sans-serif'
  ].join(','),
  h1: {
    fontSize: '3rem',
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.5rem',
    fontWeight: 800,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 700,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
}

// Component customizations
const components = {
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        fontWeight: 700,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
      },
      contained: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  MuiContainer: {
    styleOverrides: {
      root: {
        '&.MuiContainer-maxWidthXl': {
          maxWidth: '2000px', // Significantly increased from 1600px for much wider layout
        },
        paddingLeft: '24px',
        paddingRight: '24px',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-root': {
          fontSize: '1rem',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
}

// Create the theme
export const rapTheme = createTheme({
  palette: colors,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // Base spacing unit
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536, // Increased from default 1200
    },
  },
})

// Export individual pieces for use in styled components
export { colors, typography }

export default rapTheme