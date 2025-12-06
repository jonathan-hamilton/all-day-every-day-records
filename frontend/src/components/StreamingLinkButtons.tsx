import React from 'react';
import { Box, Stack } from '@mui/material';
import type { StreamingLink } from '../types/StreamingLink';

interface StreamingLinkButtonsProps {
  streamingLinks: StreamingLink[];
}

const StreamingLinkButtons: React.FC<StreamingLinkButtonsProps> = ({ streamingLinks }) => {
  if (!streamingLinks || streamingLinks.length === 0) {
    return null;
  }

  const getServiceIconPath = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'spotify':
        return '/images/icons8-spotify-logo-94.png';
      case 'amazon_music':
      case 'amazon music':
        return '/images/icons8-amazon-music-96.png';
      case 'apple_music':
      case 'apple music':
        return '/images/icons8-apple-logo-94.png';
      case 'youtube_music':
      case 'youtube music':
        return '/images/icons8-youtube-logo-96.png';
      default:
        return '';
    }
  };

  const getServiceDisplayName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'spotify':
        return 'Spotify';
      case 'youtube':
        return 'YouTube';
      case 'youtube_music':
        return 'YouTube Music';
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

  // Sort streaming links by service preference order and filter out YouTube
  const sortedLinks = [...streamingLinks]
    .filter(link => link.is_active && link.platform.toLowerCase() !== 'youtube')
    .sort((a, b) => {
      const serviceOrder = ['spotify', 'apple_music', 'youtube_music', 'amazon_music', 'soundcloud', 'bandcamp'];
      const aIndex = serviceOrder.indexOf(a.platform.toLowerCase());
      const bIndex = serviceOrder.indexOf(b.platform.toLowerCase());
      
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

  return (
    <Box sx={{ mb: 4 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2}
        sx={{ flexWrap: 'wrap' }}
      >
        {sortedLinks.map((link, index) => (
          <Box
            key={index}
            component="img"
            src={getServiceIconPath(link.platform)}
            alt={getServiceDisplayName(link.platform)}
            onClick={() => handleLinkClick(link.url)}
            sx={{
              width: 48,
              height: 48,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                filter: 'brightness(1.2)'
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default StreamingLinkButtons;