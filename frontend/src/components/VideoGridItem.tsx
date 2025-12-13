/**
 * Video Grid Item Component
 * 
 * Clickable YouTube video embed for grid display.
 * Navigates to VideoDetail page on click.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert, Typography } from '@mui/material';
import type { Video } from '../types';

interface VideoGridItemProps {
  video: Video;
}

export const VideoGridItem: React.FC<VideoGridItemProps> = ({ video }) => {
  const navigate = useNavigate();
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

  const handleClick = () => {
    navigate(`/videos/${video.id}`);
  };

  if (!video.youtube_url) {
    return null;
  }

  const videoId = extractYouTubeId(video.youtube_url);

  if (!videoId) {
    return null; // Invalid YouTube URL, don't show anything
  }

  const handleIframeError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 0 }}>
        Unable to load video. <a href={video.youtube_url} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
      </Alert>
    );
  }

  return (
    <Box 
      onClick={handleClick}
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          backgroundColor: 'grey.100',
          borderRadius: 0,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`}
          title={`${video.title} - ${video.artist}`}
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
            borderRadius: '0px',
            pointerEvents: 'none' // Prevent iframe from capturing click events
          }}
        />
      </Box>
      
      {/* Video info overlay */}
      <Box sx={{ mt: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'white',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          {video.artist}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'white',
            fontSize: '1rem'
          }}
        >
          {video.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default VideoGridItem;