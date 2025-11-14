import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import {
  Inventory as ReleasesIcon,
  Settings as SettingsIcon,
  People as UsersIcon,
  Analytics as AnalyticsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashboardCards = [
    {
      title: 'Manage Releases',
      description: 'Add, edit, and organize music releases',
      icon: <ReleasesIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: 'Manage',
      path: '/admin/releases'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: <UsersIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      action: 'Manage',
      path: '/admin/users'
    },
    {
      title: 'Analytics',
      description: 'View site statistics and release performance',
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      action: 'View',
      path: '/admin/analytics'
    },
    {
      title: 'Settings',
      description: 'Configure site settings and preferences',
      icon: <SettingsIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      action: 'Configure',
      path: '/admin/settings'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mr: 2,
                width: 60,
                height: 60
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Admin Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Welcome back, {user?.username || 'Administrator'}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      {/* Quick Stats Section */}
      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
          Quick Overview
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={3}>
          <Card sx={{ minWidth: 200, flex: '1 1 200px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Total Releases
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                -
              </Typography>
              <Typography variant="body2">
                Coming soon
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200, flex: '1 1 200px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Recent Uploads
              </Typography>
              <Typography variant="h4" component="div" color="secondary.main">
                -
              </Typography>
              <Typography variant="body2">
                This month
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200, flex: '1 1 200px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Site Views
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                -
              </Typography>
              <Typography variant="body2">
                This week
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200, flex: '1 1 200px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                -
              </Typography>
              <Typography variant="body2">
                Online now
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Main Dashboard Cards */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
          Administration Tools
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3}>
          {dashboardCards.map((card, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  {card.icon}
                  <Typography variant="h6" component="h3" sx={{ ml: 2, fontWeight: 'medium' }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => navigate(card.path)}
                  fullWidth
                >
                  {card.action}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Footer Note */}
      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          All Day Every Day Records - Admin Panel v1.0
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminDashboard;