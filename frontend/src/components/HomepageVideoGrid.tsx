/**
 * Homepage YouTube Video Grid Component
 * 
 * Displays a responsive 2x2 grid of featured YouTube videos on the homepage.
 * Grid stacks vertically on mobile devices for optimal viewing experience.
 * Videos are configurable via admin interface (4 YouTube URLs).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Alert
} from '@mui/material';
import { PlayCircleFilled as PlayIcon } from '@mui/icons-material';
import { createServices } from '../services';
import { useAuth } from '../hooks/useAuth';
import VideoGridItem from './VideoGridItem';
import VideoManageDialog from './VideoManageDialog';
import type { Video } from '../types';

interface HomepageVideo {
  id: number;
  title: string;
  youtube_url: string;
}

// Helper function to convert HomepageVideo to Video
const toVideo = (hv: HomepageVideo): Video => ({
  ...hv,
  description: null,
  artist: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

interface HomepageVideoGridProps {
  maxVideos?: number;
  showTitle?: boolean;
}

interface VideoGridState {
  loading: boolean;
  error: string | null;
  videos: HomepageVideo[];
}

export const HomepageVideoGrid: React.FC<HomepageVideoGridProps> = ({
  maxVideos = 4,
  showTitle = true
}) => {
  const services = useMemo(() => createServices(), []);
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<VideoGridState>({
    loading: true,
    error: null,
    videos: []
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch homepage videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Fetch from API endpoint - no fallbacks
        const response = await services.api.get('/get-homepage-videos.php');
        
        // Handle API response format: {success: true, videos: [...]}
        const apiResponse = response as { success?: boolean; videos?: string[] };
        const videoUrls = apiResponse.videos || [];
        
        // Convert URL array to video objects
        const videos: HomepageVideo[] = Array.isArray(videoUrls) 
          ? videoUrls.slice(0, maxVideos).map((url, index) => ({
              id: index + 1,
              title: `Featured Video ${index + 1}`,
              youtube_url: url
            }))
          : [];

        setState({
          loading: false,
          error: null,
          videos: videos.filter(v => v.youtube_url && v.youtube_url.trim() !== '') // Only include valid URLs
        });
      } catch (error) {
        console.error('Failed to fetch homepage videos:', error);
        
        // Set error state instead of using hardcoded fallbacks
        setState({
          loading: false,
          error: 'Unable to load featured videos. Please check your connection.',
          videos: []
        });
      }
    };
  
    fetchVideos();
  }, [maxVideos, services.api]);

  // Handle video updates (admin only)
  const handleVideoUpdate = async (videoUrls: string[]) => {
    try {
      const response = await services.api.post('/update-homepage-videos.php', {
        videos: videoUrls
      }) as { success?: boolean };
      
      if (response.success) {
        // Refresh the video list
        const apiResponse = await services.api.get('/get-homepage-videos.php');
        const updatedVideoUrls = (apiResponse as { videos?: string[] }).videos || [];
        
        const videos: HomepageVideo[] = updatedVideoUrls
          .slice(0, maxVideos)
          .map((url, index) => ({
            id: index + 1,
            title: `Featured Video ${index + 1}`,
            youtube_url: url
          }))
          .filter(v => v.youtube_url && v.youtube_url.trim() !== '');
        
        setState(prev => ({
          ...prev,
          videos,
          error: null
        }));
      }
    } catch (error) {
      console.error('Failed to update videos:', error);
      throw new Error('Failed to update videos. Please try again.');
    }
  };

  // Get current video URLs for dialog
  const getCurrentVideoUrls = (): string[] => {
    const urls = new Array(4).fill('');
    state.videos.forEach((video, index) => {
      if (index < 4) {
        urls[index] = video.youtube_url || '';
      }
    });
    return urls;
  };

  // Loading state
  if (state.loading) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        {showTitle && (
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1,
              mb: 4,
              color: 'white'
            }}
          >
            <PlayIcon fontSize="large" />
            Featured Videos
          </Typography>
        )}
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading featured videos...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (state.error) {
    return (
      <Box sx={{ py: 6 }}>
        {showTitle && (
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1,
              mb: 4,
              color: 'white'
            }}
          >
            <PlayIcon fontSize="large" />
            Featured Videos
          </Typography>
        )}
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      </Box>
    );
  }

  // Success state with video grid
  return (
    <Box sx={{ py: 6, position: 'relative' }}>
      {showTitle && (
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            mb: 4,
            textAlign: 'center',
            color: 'white'
          }}
        >
          <PlayIcon fontSize="large" />
          Featured Videos
        </Typography>
      )}

      {/* Check if we have videos to display */}
      {state.videos.length === 0 ? (
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          No featured videos available at this time.
        </Alert>
      ) : (
        <>
          {/* Responsive Video Grid - 2x2 on desktop, vertical stack on mobile */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 3 
            }}
          >
            {state.videos.map((video) => (
              <Box key={video.id}>
                <VideoGridItem 
                  video={toVideo(video)}
                />
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Video Management Dialog (Admin Only) */}
      {isAuthenticated && (
        <VideoManageDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleVideoUpdate}
          currentVideos={getCurrentVideoUrls()}
        />
      )}
    </Box>
  );
};

export default HomepageVideoGrid;