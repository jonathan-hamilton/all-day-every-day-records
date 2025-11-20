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
  { label: 'Home', path: '/' },
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
        <Box key={item.path} sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            onClick={() => handleNavigation(item.path)}
            sx={{
              fontWeight: isActivePath(item.path) ? 'bold' : 'normal',
              color: isActivePath(item.path) ? 'red' : 'inherit', // Red text for active page
              textDecoration: 'none', // Remove underline completely
              minWidth: '80px', // Fixed minimum width for buttons
              borderRadius: 0, // Remove rounded corners - make square
              px: 1, // Reduced horizontal padding (50% less than default)
              py: 0.5, // Reduced vertical padding (50% less than default)
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)' // Optional: slight background highlight
              }
            }}
          >
            {item.label}
          </Button>
          {isActivePath(item.path) && (
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                bottom: 4,
                width: 0,
                height: 0,
                borderLeft: '6px solid red',
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                transform: 'rotate(45deg)' // Triangle points down-right at 45 degrees
              }}
            />
          )}
        </Box>
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
            borderRadius: 0, // Remove rounded corners - make square
            px: 1, // Reduced horizontal padding
            py: 0.5, // Reduced vertical padding
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
      <AppBar position="static" color="primary" sx={{ 
        width: '100vw',
        left: 0,
        right: 0,
        margin: 0,
        padding: 0,
        backgroundImage: 'url(/images/abstract-black-grunge-texture-scaled-900x120.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll', // Changed from 'local' to prevent bleeding
        overflow: 'hidden',
        height: 'auto',
        position: 'relative', // Ensure proper containment
        zIndex: 1000, // Higher z-index to prevent interference
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
          pointerEvents: 'none' // Prevent interference with clicks
        },
        '& .MuiToolbar-root': {
          position: 'relative',
          zIndex: 2
        }
      }}>
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 67, sm: 77 }, // Increased by 20%: 56*1.2=67, 64*1.2=77
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%'
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

              {/* Brand Logo */}
              <Box
                component="img"
                src="/images/ALL_DAY_EVERY_DAY_Logo.png"
                alt="All Day Every Day Records"
                sx={{ 
                  cursor: 'pointer',
                  height: { xs: 48, sm: 60 },
                  width: 'auto',
                  objectFit: 'contain'
                }}
                onClick={() => handleNavigation('/')}
              />
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
      </AppBar>

      {/* Mobile Drawer */}
      <MobileDrawer />
    </>
  )
}