import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Home as HomeIcon } from '@mui/icons-material';
import { createServices } from '../services';
import type { Video } from '../types';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { VideoGridItem } from '../components/VideoGridItem';

interface VideoDetailPageState {
  loading: boolean;
  error: string | null;
  video: Video | null;
  relatedVideos: Video[];
}

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const services = useMemo(() => createServices(), []);
  
  const [state, setState] = useState<VideoDetailPageState>({
    loading: true,
    error: null,
    video: null,
    relatedVideos: []
  });

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) {
        setState({
          loading: false,
          error: 'No video specified',
          video: null,
          relatedVideos: []
        });
        return;
      }

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await services.videos.getVideoById(parseInt(id, 10));
        
        if (!data.video) {
          navigate('/404', { replace: true });
          return;
        }

        setState({
          loading: false,
          error: null,
          video: data.video,
          relatedVideos: data.relatedVideos
        });
      } catch (error) {
        console.error('Error fetching video:', error);
        setState({
          loading: false,
          error: 'Failed to load video details. Please try again later.',
          video: null,
          relatedVideos: []
        });
      }
    };

    fetchVideo();
  }, [id, services.videos, navigate]);

  // Update document title when video data is loaded
  useEffect(() => {
    if (state.video) {
      document.title = `${state.video.title} - ${state.video.artist} | All Day Everyday Records`;
    }

    return () => {
      document.title = 'All Day Everyday Records';
    };
  }, [state.video]);

  const handleBackToVideos = () => {
    navigate('/videos');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Loading state
  if (state.loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading video details...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  // Error state
  if (state.error || !state.video) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink
            component="button"
            variant="body2"
            onClick={handleBackToHome}
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
            Home
          </MuiLink>
          <MuiLink
            component="button"
            variant="body2"
            onClick={handleBackToVideos}
            sx={{ textDecoration: 'none' }}
          >
            Videos
          </MuiLink>
          <Typography color="text.primary">Error</Typography>
        </Breadcrumbs>

        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error || 'Video not found'}
        </Alert>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToVideos}
          >
            Back to Videos
          </Button>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleBackToHome}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  const { video, relatedVideos } = state;

  // Success state
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink
          component="button"
          variant="body2"
          onClick={handleBackToHome}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}
        >
          <HomeIcon fontSize="small" sx={{ mr: 0.5, color: 'white' }} />
          Home
        </MuiLink>
        <MuiLink
          component="button"
          variant="body2"
          onClick={handleBackToVideos}
          sx={{ textDecoration: 'none', color: 'white' }}
        >
          Videos
        </MuiLink>
        <Typography color="white">{video.title}</Typography>
      </Breadcrumbs>

      {/* YouTube Video Embed */}
      <YouTubeEmbed 
        videoUrl={video.youtube_url} 
        title={video.title}
      />

      {/* Video Information */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            backgroundImage: 'url(/images/title-inverse.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: 1.5,
            textAlign: 'left',
            display: 'inline-block',
            width: 'fit-content',
            marginBottom: '8px'
          }}
        >
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 'bold',
            color: 'black',
            margin: 0
          }}>
            {video.title}
          </Typography>
        </Box>
        
        <Box
          sx={{
            backgroundImage: 'url(/images/title-inverse.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: 1,
            textAlign: 'left',
            display: 'block',
            width: 'fit-content',
            marginBottom: '24px'
          }}
        >
          <Typography variant="h5" sx={{ 
            color: 'black',
            margin: 0
          }}>
            {video.artist}
          </Typography>
        </Box>

        {/* Description */}
        {video.description && (
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                backgroundImage: 'url(/images/title-inverse.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: 0.75,
                textAlign: 'left',
                display: 'inline-block',
                width: 'fit-content',
                marginBottom: '8px'
              }}
            >
              <Typography variant="subtitle2" sx={{ 
                textTransform: 'uppercase', 
                letterSpacing: 1,
                color: 'black',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}>
                Description
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ 
              lineHeight: 1.7,
              color: 'white'
            }}>
              {video.description}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Related Videos by Same Artist */}
      {relatedVideos.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              backgroundImage: 'url(/images/title-inverse.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: 1,
              textAlign: 'left',
              display: 'inline-block',
              width: 'fit-content',
              marginBottom: '16px'
            }}
          >
            <Typography variant="h5" sx={{ 
              color: 'black',
              margin: 0,
              fontWeight: 600
            }}>
              More from {video.artist}...
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)'
            },
            gap: 3
          }}>
            {relatedVideos.map((relatedVideo) => (
              <VideoGridItem 
                key={relatedVideo.id} 
                video={relatedVideo}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Navigation Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToVideos}
          sx={{
            borderColor: 'white',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: 1,
            px: 3,
            py: 1,
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white'
            },
            '& .MuiButton-startIcon': {
              color: 'white'
            }
          }}
        >
          Back to Videos
        </Button>
      </Box>
    </Container>
  );
};

export default VideoDetailPage;
