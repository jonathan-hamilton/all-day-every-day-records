import { Outlet } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { Navigation } from '../components'

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Header */}
      <Navigation />
      
      {/* Main content area */}
      <Container 
        component="main" 
        sx={{ 
          flex: 1, 
          py: 4,
          px: { xs: 2, sm: 3 }
        }}
      >
        <Outlet />
      </Container>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 'auto'
        }}
      >
        {/* Footer Navigation Links */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: { xs: 2, sm: 4 },
          mb: 2
        }}>
          <Box 
            component="a" 
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/contact';
            }}
            sx={{ 
              typography: 'body2',
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Contact
          </Box>
          <Box 
            component="a" 
            href="/releases"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/releases';
            }}
            sx={{ 
              typography: 'body2',
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Releases
          </Box>
          <Box 
            component="a" 
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/about';
            }}
            sx={{ 
              typography: 'body2',
              color: 'primary.main',
              textDecoration: 'none',
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
      </Box>
    </Box>
  )
}