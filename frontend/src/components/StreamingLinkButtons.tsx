import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { 
  Launch as LaunchIcon,
  MusicNote as MusicNoteIcon 
} from '@mui/icons-material';
import type { StreamingLink } from '../types/StreamingLink';

interface StreamingLinkButtonsProps {
  streamingLinks: StreamingLink[];
}

const StreamingLinkButtons: React.FC<StreamingLinkButtonsProps> = ({ streamingLinks }) => {
  if (!streamingLinks || streamingLinks.length === 0) {
    return null;
  }

  const getServiceIcon = () => {
    // For now using Material-UI icons, can be enhanced with service-specific icons later
    return <MusicNoteIcon />;
  };

  const getServiceColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'spotify':
        return '#1DB954';
      case 'youtube':
        return '#FF0000';
      case 'apple_music':
      case 'apple music':
        return '#000000';
      case 'amazon_music':
      case 'amazon music':
        return '#00A8E1';
      case 'soundcloud':
        return '#FF5500';
      case 'bandcamp':
        return '#629AA0';
      default:
        return '#666666';
    }
  };

  const getServiceDisplayName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'spotify':
        return 'Spotify';
      case 'youtube':
        return 'YouTube';
      case 'apple_music':
        return 'Apple Music';
      case 'amazon_music':
        return 'Amazon Music';
      case 'soundcloud':
        return 'SoundCloud';
      case 'bandcamp':
        return 'Bandcamp';
      default:
        return platform.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Sort streaming links by service preference order
  const sortedLinks = [...streamingLinks].filter(link => link.is_active).sort((a, b) => {
    const serviceOrder = ['spotify', 'youtube', 'apple_music', 'amazon_music', 'soundcloud', 'bandcamp'];
    const aIndex = serviceOrder.indexOf(a.platform.toLowerCase());
    const bIndex = serviceOrder.indexOf(b.platform.toLowerCase());
    
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="subtitle2" 
        color="text.secondary" 
        sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}
      >
        Listen Now
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2}
        sx={{ flexWrap: 'wrap' }}
      >
        {sortedLinks.map((link) => (
          <Button
            key={link.id}
            variant="contained"
            size="large"
            startIcon={getServiceIcon()}
            endIcon={<LaunchIcon />}
            onClick={() => handleLinkClick(link.url)}
            sx={{
              backgroundColor: getServiceColor(link.platform),
              borderColor: getServiceColor(link.platform),
              color: '#ffffff',
              fontWeight: 'bold',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              minWidth: { xs: '100%', sm: '160px' },
              '&:hover': {
                backgroundColor: getServiceColor(link.platform),
                borderColor: getServiceColor(link.platform),
                boxShadow: `0 4px 12px ${getServiceColor(link.platform)}40`,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            {getServiceDisplayName(link.platform)}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default StreamingLinkButtons;