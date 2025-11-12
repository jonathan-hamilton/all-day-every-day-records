import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert
} from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBackToReleases = () => {
    navigate('/releases');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" component="h1" sx={{ fontSize: '8rem', fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Release Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The release you're looking for doesn't exist or may have been removed.
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
        If you believe this is an error, please check the URL or try searching for the release from our releases page.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={handleBackToHome}
        >
          Back to Home
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToReleases}
        >
          Browse Releases
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;