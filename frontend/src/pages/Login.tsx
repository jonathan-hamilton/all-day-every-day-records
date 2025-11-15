/**
 * Login Page for All Day Every Day Records Admin
 * 
 * Provides admin authentication interface with responsive design and 
 * integration with authentication context. Redirects to admin dashboard
 * after successful login.
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Container,
  Typography
} from '@mui/material';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/Auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to intended location or admin dashboard
      const from = (location.state as { from?: Location })?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Handle login form submission
  const handleLogin = async (credentials: LoginCredentials): Promise<void> => {
    const success = await login(credentials.email, credentials.password);
    
    if (success) {
      // Navigation will be handled by the useEffect above
      console.log('Login successful, redirecting...');
    }
    // Errors are handled by the auth context and displayed in the form
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              mb: 1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            ALL DAY EVERY DAY
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: 'secondary.main',
              fontWeight: 'bold',
              letterSpacing: '0.1em'
            }}
          >
            RECORDS
          </Typography>
        </Box>

        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
          onClearError={clearError}
        />

        {/* Return to Site Link */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ color: 'grey.500' }}
          >
            <Box
              component="a" 
              href="/" 
              sx={{ 
                color: 'inherit', 
                textDecoration: 'underline',
                '&:hover': { 
                  color: 'secondary.main' 
                }
              }}
            >
              ← Return to Main Site
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;