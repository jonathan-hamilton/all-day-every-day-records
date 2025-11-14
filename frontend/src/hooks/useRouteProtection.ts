/**
 * Route Protection Hook
 * 
 * Custom hook for checking if current route requires authentication
 * and whether the user has access. Useful for conditional UI rendering
 * based on route protection status.
 */

import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRouteProtection = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  const isProtectedRoute = location.pathname.startsWith('/admin');
  const isAccessible = isProtectedRoute ? isAuthenticated : true;
  
  return {
    isProtectedRoute,
    isAccessible,
    isLoading,
    shouldRedirect: isProtectedRoute && !isLoading && !isAuthenticated
  };
};