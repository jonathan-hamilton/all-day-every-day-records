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
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 0,
        minWidth: 0,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
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
      
      {/* Video Artist - Auto-sized grey box */}
      <Box
        sx={{
          backgroundImage: 'url(/images/title-inverse.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: 0.75,
          textAlign: 'left',
          display: 'inline-block',
          width: 'fit-content',
          maxWidth: '100%',
          marginBottom: '2px'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'black',
            fontWeight: 'medium',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {video.artist || 'Unknown Artist'}
        </Typography>
      </Box>

      {/* Video Title - Auto-sized grey box */}
      <Box
        sx={{
          backgroundImage: 'url(/images/title-inverse.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: 0.75,
          textAlign: 'left',
          display: 'inline-block',
          width: 'fit-content',
          maxWidth: '100%'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'black',
            fontWeight: 'medium',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {video.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default VideoGridItem;