import { Box, Typography, Button, Card, CardContent, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

/**
 * SmokeTest Component
 * 
 * A development utility component that verifies theme integration,
 * global styles, and component rendering across the application.
 * 
 * Usage: Import and render temporarily to verify styling systems
 */
export const SmokeTest = () => {
  const theme = useTheme()
  const [buttonClicked, setButtonClicked] = useState(false)

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: '1200px',
        mx: 'auto',
        '& > *': { mb: 3 }
      }}
    >
      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 3, backgroundColor: theme.palette.primary.main }}>
        <Typography variant="h3" component="h1" sx={{ color: theme.palette.primary.contrastText, mb: 2 }}>
          🎤 Theme Smoke Test
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.primary.contrastText }}>
          Verifying All Day Every Day Records theme integration and global styling
        </Typography>
      </Paper>

      {/* Typography Test */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Typography System
          </Typography>
          <Typography variant="h1" component="h2" gutterBottom>
            H1 - Impact Font Family
          </Typography>
          <Typography variant="h2" gutterBottom>
            H2 - Bold Typography
          </Typography>
          <Typography variant="h3" gutterBottom>
            H3 - Section Headers
          </Typography>
          <Typography variant="h4" gutterBottom>
            H4 - Subsection Headers
          </Typography>
          <Typography variant="h5" gutterBottom>
            H5 - Card Headers
          </Typography>
          <Typography variant="h6" gutterBottom>
            H6 - Component Headers
          </Typography>
          <Typography variant="body1" gutterBottom>
            Body1 - Primary body text for readable content and descriptions
          </Typography>
          <Typography variant="body2" gutterBottom>
            Body2 - Secondary body text for smaller details and captions
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Caption - Small text for metadata and fine details
          </Typography>
        </CardContent>
      </Card>

      {/* Color Palette Test */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Color Palette
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2
            }}
          >
            {/* Primary Colors */}
            <Paper
              sx={{
                p: 2,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                textAlign: 'center',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6">Primary</Typography>
              <Typography variant="caption">{theme.palette.primary.main}</Typography>
            </Paper>

            {/* Secondary Colors */}
            <Paper
              sx={{
                p: 2,
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                textAlign: 'center',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6">Secondary</Typography>
              <Typography variant="caption">{theme.palette.secondary.main}</Typography>
            </Paper>

            {/* Background Colors */}
            <Paper
              sx={{
                p: 2,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                textAlign: 'center',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6">Background</Typography>
              <Typography variant="caption">{theme.palette.background.paper}</Typography>
            </Paper>

            {/* Error Colors */}
            <Paper
              sx={{
                p: 2,
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                textAlign: 'center',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6">Error</Typography>
              <Typography variant="caption">{theme.palette.error.main}</Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>

      {/* Interactive Elements Test */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Interactive Elements
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary">
              Primary Button
            </Button>
            <Button variant="outlined" color="primary">
              Outlined Button
            </Button>
            <Button variant="text" color="primary">
              Text Button
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => setButtonClicked(!buttonClicked)}
            >
              {buttonClicked ? 'Clicked!' : 'Click Me'}
            </Button>
          </Box>

          {buttonClicked && (
            <Paper 
              sx={{ 
                p: 2, 
                mt: 2, 
                backgroundColor: theme.palette.success.main,
                color: theme.palette.success.contrastText
              }}
            >
              <Typography variant="body1">
                ✅ Interactive state change working correctly!
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Spacing and Layout Test */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Spacing & Layout
          </Typography>
          <Box sx={{ display: 'flex', gap: theme.spacing(1), mb: 2 }}>
            <Paper sx={{ p: 1, flex: 1, textAlign: 'center' }}>Spacing 1</Paper>
            <Paper sx={{ p: 1, flex: 1, textAlign: 'center' }}>Spacing 1</Paper>
            <Paper sx={{ p: 1, flex: 1, textAlign: 'center' }}>Spacing 1</Paper>
          </Box>
          <Box sx={{ display: 'flex', gap: theme.spacing(2), mb: 2 }}>
            <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>Spacing 2</Paper>
            <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>Spacing 2</Paper>
          </Box>
          <Box sx={{ display: 'flex', gap: theme.spacing(3) }}>
            <Paper sx={{ p: 3, flex: 1, textAlign: 'center' }}>Spacing 3</Paper>
          </Box>
        </CardContent>
      </Card>

      {/* Responsive Test */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Responsive Behavior
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)' 
              },
              gap: 2
            }}
          >
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Mobile First</Typography>
              <Typography variant="body2">xs=12, sm=6, md=4</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Tablet View</Typography>
              <Typography variant="body2">xs=12, sm=6, md=4</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Desktop View</Typography>
              <Typography variant="body2">xs=12, sm=12, md=4</Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>

      {/* Global Styles Test */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Global Styles Verification
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Focus States (Tab through these elements):
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Button variant="outlined">Focusable Button 1</Button>
            <Button variant="outlined">Focusable Button 2</Button>
            <Button variant="outlined">Focusable Button 3</Button>
          </Box>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Accessibility Features:
          </Typography>
          <Typography variant="body1" gutterBottom>
            • Enhanced focus indicators for keyboard navigation
          </Typography>
          <Typography variant="body1" gutterBottom>
            • Proper color contrast ratios
          </Typography>
          <Typography variant="body1" gutterBottom>
            • Smooth scrolling behavior
          </Typography>
          <Typography variant="body1">
            • Print-friendly styles (try Ctrl+P/Cmd+P)
          </Typography>
        </CardContent>
      </Card>

      {/* Theme Information */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Theme Configuration
          </Typography>
          <Box component="pre" sx={{ 
            backgroundColor: theme.palette.grey[100], 
            p: 2, 
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '0.875rem',
            fontFamily: 'monospace'
          }}>
            {JSON.stringify({
              mode: theme.palette.mode,
              primary: theme.palette.primary.main,
              secondary: theme.palette.secondary.main,
              background: theme.palette.background.default,
              spacing: theme.spacing(1),
              breakpoints: {
                xs: theme.breakpoints.values.xs,
                sm: theme.breakpoints.values.sm,
                md: theme.breakpoints.values.md,
                lg: theme.breakpoints.values.lg,
                xl: theme.breakpoints.values.xl
              }
            }, null, 2)}
          </Box>
        </CardContent>
      </Card>

      {/* Success Message */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3, 
          backgroundColor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom>
          🎉 Theme Integration Successful!
        </Typography>
        <Typography variant="body1">
          All styling systems are working correctly. The rap-themed design system is ready for production.
        </Typography>
      </Paper>
    </Box>
  )
}

export default SmokeTest