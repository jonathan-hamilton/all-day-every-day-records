import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { PlayCircleFilled as PlayIcon } from '@mui/icons-material';

interface YouTubeEmbedProps {
  videoUrl?: string;
  title?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoUrl, title }) => {
  const [hasError, setHasError] = useState(false);

  // Extract YouTube video ID from various URL formats
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  if (!videoUrl) {
    return null;
  }

  const videoId = extractYouTubeId(videoUrl);

  if (!videoId) {
    return null; // Invalid YouTube URL, don't show anything
  }

  const handleIframeError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}
        >
          Video
        </Typography>
        <Alert severity="warning">
          Unable to load video. <a href={videoUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="subtitle2" 
        color="text.secondary" 
        sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <PlayIcon fontSize="small" />
        Video
      </Typography>
      
      <Box
        sx={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          backgroundColor: 'grey.100',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`}
          title={title ? `${title} - Video` : 'Release Video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onError={handleIframeError}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '8px'
          }}
        />
      </Box>
    </Box>
  );
};

export default YouTubeEmbed;