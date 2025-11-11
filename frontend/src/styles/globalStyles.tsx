import { GlobalStyles } from '@mui/material'
import type { Theme } from '@mui/material/styles'

// Enhanced global styles beyond MUI CssBaseline for rap-themed design
export const rapGlobalStyles = (
  <GlobalStyles
    styles={(theme: Theme) => ({
      // Enhanced body and html styling
      'html, body': {
        margin: 0,
        padding: 0,
        fontFamily: theme.typography.fontFamily,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        lineHeight: 1.6,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },

      // Global box-sizing for consistent layout
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },

      // Remove default margins and paddings
      'h1, h2, h3, h4, h5, h6, p, ul, ol, li, figure, figcaption, blockquote, dl, dd': {
        margin: 0,
        padding: 0,
      },

      // Enhanced headings with rap-themed styling
      'h1, h2, h3, h4, h5, h6': {
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.h1.fontWeight,
        lineHeight: 1.2,
        marginBottom: theme.spacing(2),
        color: theme.palette.text.primary,
      },

      // Links styling
      'a': {
        color: theme.palette.secondary.main,
        textDecoration: 'none',
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
          color: theme.palette.secondary.light,
          textDecoration: 'underline',
        },
        '&:focus': {
          outline: `2px solid ${theme.palette.secondary.main}`,
          outlineOffset: '2px',
          borderRadius: '2px',
        },
      },

      // Button reset for consistent styling
      'button': {
        border: 'none',
        background: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
      },

      // Enhanced list styling
      'ul, ol': {
        listStyle: 'none',
        margin: 0,
        padding: 0,
      },

      // Image responsiveness and styling
      'img': {
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
      },

      // Form elements baseline
      'input, textarea, select': {
        font: 'inherit',
        color: 'inherit',
      },

      // Focus styles for accessibility
      ':focus-visible': {
        outline: `2px solid ${theme.palette.secondary.main}`,
        outlineOffset: '2px',
        borderRadius: '2px',
      },

      // Custom scrollbar for webkit browsers (rap-themed)
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: theme.palette.background.paper,
      },
      '::-webkit-scrollbar-thumb': {
        background: theme.palette.primary.main,
        borderRadius: '4px',
        '&:hover': {
          background: theme.palette.primary.dark,
        },
      },

      // Selection styling with brand colors
      '::selection': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
      },

      // Root element styling
      '#root': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },

      // Enhanced typography spacing
      'p + p': {
        marginTop: theme.spacing(2),
      },

      // Print styles
      '@media print': {
        'body': {
          fontSize: '12pt',
          lineHeight: 1.5,
        },
        'h1, h2, h3, h4, h5, h6': {
          pageBreakAfter: 'avoid',
          marginTop: theme.spacing(3),
          marginBottom: theme.spacing(1),
        },
        'p, ul, ol': {
          orphans: 2,
          widows: 2,
        },
        'a': {
          color: theme.palette.text.primary,
          textDecoration: 'underline',
        },
      },

      // Mobile-specific enhancements
      '@media (max-width: 768px)': {
        'body': {
          fontSize: '16px', // Prevent zoom on iOS
          WebkitTextSizeAdjust: '100%',
        },
      },

      // High contrast mode support
      '@media (prefers-contrast: high)': {
        'a': {
          textDecoration: 'underline',
        },
        'button': {
          border: `1px solid ${theme.palette.text.primary}`,
        },
      },

      // Reduced motion support
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
          scrollBehavior: 'auto !important',
        },
      },
    })}
  />
)

export default rapGlobalStyles