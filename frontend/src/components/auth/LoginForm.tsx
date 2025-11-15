/**
 * Login Form Component for All Day Every Day Records
 * 
 * Reusable login form component with Material-UI styling, form validation,
 * and responsive design. Handles authentication state and error display.
 */

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import type { LoginCredentials } from '../../types/Auth';

export interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      errors.password = 'Password must be at least 3 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Clear previous errors
    if (error) {
      onClearError();
    }
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Submit login credentials
    try {
      await onSubmit({
        email: formData.email.trim(),
        password: formData.password
      });
    } catch (error) {
      // Error handling is managed by parent component
      console.error('Login form submission error:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            color: 'primary.contrastText',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Admin Login
        </Typography>

        {/* Error Display */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={onClearError}
          >
            {error}
          </Alert>
        )}

        {/* Email Field */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={!!formErrors.email}
          helperText={formErrors.email}
          disabled={isLoading}
          autoComplete="email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
            style: {
              color: 'white'
            }
          }}
          InputLabelProps={{
            style: { color: 'rgba(255, 255, 255, 0.7)' }
          }}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
              '& input': {
                color: 'white',
              }
            }
          }}
        />

        {/* Password Field */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={!!formErrors.password}
          helperText={formErrors.password}
          disabled={isLoading}
          autoComplete="current-password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                  disabled={isLoading}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            style: {
              color: 'white'
            }
          }}
          InputLabelProps={{
            style: { color: 'rgba(255, 255, 255, 0.7)' }
          }}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
              '& input': {
                color: 'white',
              }
            },
            '& .MuiInputAdornment-root .MuiSvgIcon-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            }
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading || !formData.email || !formData.password}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            position: 'relative'
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress 
                size={20} 
                sx={{ position: 'absolute', left: '50%', ml: -1.25 }} 
              />
              <span style={{ opacity: 0 }}>Sign In</span>
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Development Credentials Note */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.900', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: 'grey.400', textAlign: 'center' }}>
            <strong>Development Mode:</strong><br />
            Use credentials: admin/admin123 or dev/dev123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;