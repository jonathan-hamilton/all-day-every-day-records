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

const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Releases', path: '/releases' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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
    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          onClick={() => handleNavigation(item.path)}
          sx={{
            fontWeight: isActivePath(item.path) ? 'bold' : 'normal',
            textDecoration: isActivePath(item.path) ? 'underline' : 'none'
          }}
        >
          {item.label}
        </Button>
      ))}
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
      </List>
    </Drawer>
  )

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
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
              flexGrow: 1,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => handleNavigation('/')}
          >
            All Day Every Day Records
          </Typography>

          {/* Desktop Navigation */}
          <DesktopNav />
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <MobileDrawer />
    </>
  )
}