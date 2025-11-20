import { Outlet, useNavigate } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { Navigation } from '../components'

export default function MainLayout() {
  const navigate = useNavigate()

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      overflow: 'hidden', // Prevent layout shifts from scrollbars
      backgroundColor: 'black'
    }}>
      {/* Navigation Header */}
      <Navigation />
      
      {/* Main content area with consistent width */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto', // Handle scrolling at content level
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box
          component="main" 
          sx={{ 
            flex: 1, 
            py: 4,
            px: { xs: 2, sm: 3 },
            maxWidth: 1200,
            margin: '0 auto',
            width: '100%'
          }}
        >
          <Outlet />
        </Box>
      </Box>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 'auto',
          backgroundImage: 'url(/images/abstract-black-grunge-texture-scaled-900x898.webp)',
          backgroundSize: 'cover', // Cover the footer area without distortion
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'local',
          overflow: 'hidden',
          height: 'auto',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text readability
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Footer Navigation Links */}
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: { xs: 2, sm: 4 },
            mb: 2
          }}>
            <Box 
              component="button" 
              onClick={() => navigate('/contact')}
              sx={{ 
                typography: 'body2',
                color: 'primary.main',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Contact
            </Box>
            <Box 
              component="button" 
              onClick={() => navigate('/releases')}
              sx={{ 
                typography: 'body2',
                color: 'primary.main',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Releases
            </Box>
            <Box 
              component="button" 
              onClick={() => navigate('/about')}
              sx={{ 
                typography: 'body2',
                color: 'primary.main',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              About
            </Box>
          </Box>
          
          {/* Copyright */}
          <Box sx={{ 
            textAlign: 'center',
            typography: 'body2', 
            color: 'text.secondary'
          }}>
            &copy; 2025 All Day Every Day Records. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  )
}