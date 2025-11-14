/**
 * Protected Route Component for Admin Authentication
 * 
 * Wraps admin routes to ensure only authenticated users can access them.
 * Redirects unauthorized users to login page while preserving intended destination.
 * Shows loading spinner during authentication checks.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Future: role-based access control
  fallbackPath?: string; // Custom redirect path
}

/**
 * ProtectedRoute Component
 * 
 * Checks authentication status and either renders children or redirects to login.
 * Preserves the intended destination in location state for post-login redirect.
 * 
 * @param children - The protected component/route to render if authenticated
 * @param requiredRole - Optional role requirement (future enhancement)
 * @param fallbackPath - Custom redirect path (defaults to /login)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          color: 'white'
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: 'primary.main',
            mb: 3 
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            opacity: 0.8,
            textAlign: 'center' 
          }}
        >
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Preserve the intended destination for post-login redirect
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Future: Role-based access control
  if (requiredRole && user?.is_admin !== true) {
    // For now, we'll just check is_admin for admin routes
    console.warn(`User ${user?.username} attempted to access admin route without admin privileges`);
    
    // Could redirect to unauthorized page or dashboard
    // For now, redirect to login (can be enhanced later)
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ 
          from: location,
          error: 'Insufficient permissions' 
        }} 
        replace 
      />
    );
  }

  // User is authenticated (and has required permissions if specified)
  return <>{children}</>;
};

export default ProtectedRoute;