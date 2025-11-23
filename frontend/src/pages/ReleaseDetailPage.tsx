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
import type { ReleaseWithDetails } from '../types/Release';
import type { ReleaseArtist } from '../types/Artist';
import StreamingLinkButtons from '../components/StreamingLinkButtons';
import YouTubeEmbed from '../components/YouTubeEmbed';
import RelatedReleases from '../components/RelatedReleases';

interface ReleaseDetailPageState {
  loading: boolean;
  error: string | null;
  release: ReleaseWithDetails | null;
}

const ReleaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const services = useMemo(() => createServices(), []);
  
  const [state, setState] = useState<ReleaseDetailPageState>({
    loading: true,
    error: null,
    release: null
  });

  useEffect(() => {
    const fetchRelease = async () => {
      if (!id) {
        setState({
          loading: false,
          error: 'No release specified',
          release: null
        });
        return;
      }

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const releaseData = await services.releases.getReleaseById(parseInt(id, 10));
        
        if (!releaseData) {
          // Navigate to 404 page for missing releases
          navigate('/404', { replace: true });
          return;
        }

        setState({
          loading: false,
          error: null,
          release: releaseData
        });
      } catch (error) {
        console.error('Error fetching release:', error);
        setState({
          loading: false,
          error: 'Failed to load release details. Please try again later.',
          release: null
        });
      }
    };

    fetchRelease();
  }, [id, services.releases, navigate]);

  // Update document title when release data is loaded
  useEffect(() => {
    if (state.release) {
      const artistName = state.release.artists?.map((artist: ReleaseArtist) => artist.name).join(', ') || '';
      document.title = `${state.release.title}${artistName ? ` - ${artistName}` : ''} | All Day Every Day Records`;
    }

    // Cleanup: reset title when component unmounts
    return () => {
      document.title = 'All Day Every Day Records';
    };
  }, [state.release]);

  const handleBackToReleases = () => {
    navigate('/releases');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Find YouTube URL from streaming links
  const getYouTubeUrl = (streamingLinks: typeof release.streaming_links) => {
    const youTubeLink = streamingLinks?.find(link => 
      link.is_active && link.platform.toLowerCase() === 'youtube'
    );
    return youTubeLink?.url;
  };

  // Loading state
  if (state.loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading release details...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  // Error state
  if (state.error || !state.release) {
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
            onClick={handleBackToReleases}
            sx={{ textDecoration: 'none' }}
          >
            Releases
          </MuiLink>
          <Typography color="text.primary">Error</Typography>
        </Breadcrumbs>

        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error || 'Release not found'}
        </Alert>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToReleases}
          >
            Back to Releases
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

  const { release } = state;

  // Success state - comprehensive layout
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
          onClick={handleBackToReleases}
          sx={{ textDecoration: 'none', color: 'white' }}
        >
          Releases
        </MuiLink>
          <Typography color="white">{release.title}</Typography>
      </Breadcrumbs>

      {/* Main Release Content */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '400px 1fr' }, 
        gap: 4, 
        mb: 4 
      }}>
        {/* Cover Image Section */}
        <Box>
          <Box
            component="img"
            src={release.cover_image_url || '/images/placeholder-cover.jpg'}
            alt={`${release.title} cover art`}
            sx={{
              width: '100%',
              aspectRatio: '1',
              objectFit: 'cover',
              borderRadius: 0,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              backgroundColor: 'grey.800',
              border: '2px solid #333'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('placeholder-cover.jpg')) {
                target.src = '/images/placeholder-cover.jpg';
              }
            }}
          />
        </Box>

        {/* Release Information Section */}
        <Box>
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
              {release.title}
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
              {release.artists?.map((artist: ReleaseArtist) => artist.name).join(', ')}
            </Typography>
          </Box>

          {/* Release Metadata Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
            gap: 3, 
            mb: 4 
          }}>
            {/* Release Type & Date */}
            <Box>
              <Box
                sx={{
                  backgroundImage: 'url(/images/title-inverse.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: 0.75,
                  textAlign: 'left',
                  display: 'inline-block',
                  width: 'fit-content',
                  marginBottom: '2px'
                }}
              >
                <Typography variant="subtitle2" sx={{ 
                  textTransform: 'uppercase', 
                  letterSpacing: 1,
                  color: 'black',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}>
                  Release Type
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                mb: 2, 
                textTransform: 'capitalize',
                color: 'white'
              }}>
                {release.release_type}
              </Typography>
              
              {release.release_date && (
                <>
                  <Box
                    sx={{
                      backgroundImage: 'url(/images/title-inverse.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      padding: 0.75,
                      textAlign: 'left',
                      display: 'inline-block',
                      width: 'fit-content',
                      marginBottom: '2px'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ 
                      textTransform: 'uppercase', 
                      letterSpacing: 1,
                      color: 'black',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}>
                      Release Date
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {new Date(release.release_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </>
              )}
            </Box>

            {/* Label & Catalog */}
            <Box>
              {release.label && (
                <>
                  <Box
                    sx={{
                      backgroundImage: 'url(/images/title-inverse.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      padding: 0.75,
                      textAlign: 'left',
                      display: 'inline-block',
                      width: 'fit-content',
                      marginBottom: '2px'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ 
                      textTransform: 'uppercase', 
                      letterSpacing: 1,
                      color: 'black',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}>
                      Label
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2, color: 'white' }}>
                    {release.label.name}
                  </Typography>
                </>
              )}
              
              {release.catalog_number && (
                <>
                  <Box
                    sx={{
                      backgroundImage: 'url(/images/title-inverse.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      padding: 0.75,
                      textAlign: 'left',
                      display: 'inline-block',
                      width: 'fit-content',
                      marginBottom: '2px'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ 
                      textTransform: 'uppercase', 
                      letterSpacing: 1,
                      color: 'black',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}>
                      Catalog Number
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {release.catalog_number}
                  </Typography>
                </>
              )}
            </Box>

            {/* Duration */}
            <Box>
              {release.duration_seconds && (
                <>
                  <Box
                    sx={{
                      backgroundImage: 'url(/images/title-inverse.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      padding: 0.75,
                      textAlign: 'left',
                      display: 'inline-block',
                      width: 'fit-content',
                      marginBottom: '2px'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ 
                      textTransform: 'uppercase', 
                      letterSpacing: 1,
                      color: 'black',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}>
                      Duration
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {Math.floor(release.duration_seconds / 60)}:{(release.duration_seconds % 60).toString().padStart(2, '0')}
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {/* Description */}
          {release.description && (
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
                {release.description}
              </Typography>
            </Box>
          )}

          {/* Streaming Links */}
          <StreamingLinkButtons streamingLinks={release.streaming_links} />
        </Box>
      </Box>

      {/* YouTube Video Embed - Full Width Centered */}
      <YouTubeEmbed 
        videoUrl={getYouTubeUrl(release.streaming_links)} 
        title={release.title}
      />

      {/* Related Releases */}
      <RelatedReleases 
        currentReleaseId={release.id} 
        artists={release.artists}
      />

      {/* Navigation Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToReleases}
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
          Back to Releases
        </Button>
      </Box>
    </Container>
  );
};

export default ReleaseDetailPage;