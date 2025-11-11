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
          py: 2, 
          px: 2,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
          mt: 'auto'
        }}
      >
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          &copy; 2025 All Day Every Day Records. All rights reserved.
        </Box>
      </Box>
    </Box>
  )
}