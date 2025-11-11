/**
 * Connectivity Status Component
 * 
 * Displays the current status of backend API connectivity.
 * Shows health check results and connection information.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon
} from '@mui/icons-material';

import { createServices } from '../services';
import type { HealthCheckResponse, ApiErrorType } from '../types';
import { isDevelopment } from '../config/api';

interface ConnectivityStatusProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const ConnectivityStatus: React.FC<ConnectivityStatusProps> = ({
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const services = createServices();

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const health = await services.api.healthCheck();
      setHealthStatus(health);
      setLastChecked(new Date());
      
    } catch (err) {
      const apiError = err as ApiErrorType;
      setError(apiError.message);
      setHealthStatus(null);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial health check
    checkHealth();

    // Setup auto-refresh if enabled
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(checkHealth, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (): 'success' | 'error' | 'warning' => {
    if (!healthStatus) return 'error';
    return healthStatus.status === 'healthy' ? 'success' : 'error';
  };

  const getStatusIcon = () => {
    if (loading) {
      return <CircularProgress size={20} />;
    }
    
    if (!healthStatus || healthStatus.status === 'unhealthy') {
      return <ErrorIcon color="error" />;
    }
    
    return <CheckCircleIcon color="success" />;
  };

  const getConnectionIcon = () => {
    if (!healthStatus || !healthStatus.database.connected) {
      return <WifiOffIcon color="error" />;
    }
    return <WifiIcon color="success" />;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Backend Connectivity
        </Typography>
        
        <Box display="flex" alignItems="center" mb={2}>
          {getStatusIcon()}
          <Typography variant="body1" sx={{ ml: 1, mr: 2 }}>
            API Status:
          </Typography>
          <Chip
            label={healthStatus?.status || 'Unknown'}
            color={getStatusColor()}
            size="small"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Connection Error</AlertTitle>
            {error}
          </Alert>
        )}

        {healthStatus && (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <Box>
                <Box display="flex" alignItems="center" mb={1}>
                  {getConnectionIcon()}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Database: {healthStatus.database.connected ? 'Connected' : 'Disconnected'}
                  </Typography>
                </Box>
                
                {healthStatus.database.responseTime && (
                  <Typography variant="caption" color="text.secondary">
                    Response time: {healthStatus.database.responseTime}ms
                  </Typography>
                )}
              </Box>
              
              <Box>
                <Typography variant="body2">
                  Environment: {healthStatus.api.environment}
                </Typography>
                <Typography variant="body2">
                  Version: {healthStatus.api.version}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="caption" color="text.secondary">
              Last checked: {lastChecked?.toLocaleTimeString() || 'Never'}
            </Typography>
          </>
        )}

        {isDevelopment() && (
          <Box mt={2}>
            <Alert severity="info">
              <Typography variant="caption">
                Development mode: API connectivity checks are enabled.
                Backend URL: {services.api.getClient().defaults.baseURL}
              </Typography>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};