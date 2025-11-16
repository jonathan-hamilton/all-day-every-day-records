import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box
} from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'

const baseNavigationItems = [
  { label: 'Releases', path: '/releases' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isAuthenticated, user, logout } = useAuth()

  // Create dynamic navigation items based on auth state
  const navigationItems = [...baseNavigationItems]
  if (isAuthenticated && user?.is_admin) {
    navigationItems.push({ label: 'Admin', path: '/admin/dashboard' })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // Desktop Navigation
  const DesktopNav = () => (
    <Box sx={{ 
      display: { xs: 'none', md: 'flex' }, 
      gap: 1, 
      alignItems: 'center',
      minWidth: '400px', // Fixed minimum width to prevent shifting
      justifyContent: 'center' // Center the items within the fixed width
    }}>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          onClick={() => handleNavigation(item.path)}
          sx={{
            fontWeight: isActivePath(item.path) ? 'bold' : 'normal',
            textDecoration: isActivePath(item.path) ? 'underline' : 'none',
            minWidth: '80px' // Fixed minimum width for buttons
          }}
        >
          {item.label}
        </Button>
      ))}
      {isAuthenticated && user?.is_admin && (
        <Button
          color="inherit"
          variant="outlined"
          onClick={handleLogout}
          sx={{
            ml: 1,
            backgroundColor: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            minWidth: '80px', // Fixed minimum width for consistency
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.7)',
            }
          }}
        >
          Logout
        </Button>
      )}
    </Box>
  )

  // Mobile Drawer
  const MobileDrawer = () => (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true // Better open performance on mobile
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: 250,
          backgroundColor: theme.palette.background.paper
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActivePath(item.path)}
            >
              <ListItemText 
                primary={item.label}
                sx={{
                  fontWeight: isActivePath(item.path) ? 'bold' : 'normal'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && user?.is_admin && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                mt: 1
              }}
            >
              <ListItemText 
                primary="Logout"
                sx={{
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  )

  return (
    <>
      <AppBar position="static" color="primary" sx={{ width: '100%' }}>
        <Box sx={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <Toolbar sx={{ 
            justifyContent: 'space-between',
            alignItems: 'center',
            px: { xs: 2, sm: 3 },
            minHeight: { xs: 56, sm: 64 }
          }}>
            {/* Mobile Menu Icon & Brand Name Container */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
              {/* Mobile Menu Icon */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>

              {/* Brand Name */}
              <Typography
                variant="h6"
                component="div"
                sx={{ 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => handleNavigation('/')}
              >
                All Day Every Day Records
              </Typography>
            </Box>

            {/* Desktop Navigation - Center */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              flex: '1 1 auto',
              justifyContent: 'center',
              mx: 2
            }}>
              <DesktopNav />
            </Box>

            {/* PANNES AVE Image - Right */}
            <Box sx={{ flex: '0 0 auto' }}>
              {!imageError ? (
                <Box 
                  component="img"
                  src="/images/pannes-ave.jpg"
                  alt="Pannes Ave"
                  onError={() => setImageError(true)}
                  sx={{
                    height: 40,
                    width: 'auto',
                    display: { xs: 'none', sm: 'block' },
                    borderRadius: 1
                  }}
                />
              ) : (
                <Box 
                  sx={{
                    height: 40,
                    minWidth: 60,
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1,
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.7)',
                    textAlign: 'center'
                  }}
                >
                  PANNES<br/>AVE
                </Box>
              )}
            </Box>
          </Toolbar>
        </Box>
      </AppBar>

      {/* Mobile Drawer */}
      <MobileDrawer />
    </>
  )
}