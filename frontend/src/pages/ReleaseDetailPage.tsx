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
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const services = useMemo(() => createServices(), []);
  
  const [state, setState] = useState<ReleaseDetailPageState>({
    loading: true,
    error: null,
    release: null
  });

  useEffect(() => {
    const fetchRelease = async () => {
      if (!slug) {
        setState({
          loading: false,
          error: 'No release specified',
          release: null
        });
        return;
      }

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const releaseData = await services.releases.getReleaseBySlug(slug);
        
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
  }, [slug, services.releases, navigate]);

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
        <Typography color="text.primary">{release.title}</Typography>
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
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              backgroundColor: 'grey.200',
              border: '1px solid',
              borderColor: 'grey.300'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Prevent infinite loop by checking if we're already using fallback
              if (target.src.includes('placeholder-cover.jpg')) {
                // Use a data URL as final fallback to prevent network requests
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
              } else {
                target.src = '/images/placeholder-cover.jpg';
              }
            }}
          />
        </Box>

        {/* Release Information Section */}
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {release.title}
          </Typography>
          
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            {release.artists?.map((artist: ReleaseArtist) => artist.name).join(', ')}
          </Typography>

          {/* Release Metadata Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
            gap: 3, 
            mb: 4 
          }}>
            {/* Release Type & Date */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Release Type
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, textTransform: 'capitalize' }}>
                {release.release_type}
              </Typography>
              
              {release.release_date && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Release Date
                  </Typography>
                  <Typography variant="body1">
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
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Label
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {release.label.name}
                  </Typography>
                </>
              )}
              
              {release.catalog_number && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Catalog Number
                  </Typography>
                  <Typography variant="body1">
                    {release.catalog_number}
                  </Typography>
                </>
              )}
            </Box>

            {/* Track Count & Duration */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Track Count
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {release.track_count} {release.track_count === 1 ? 'track' : 'tracks'}
              </Typography>
              
              {release.duration_seconds && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {Math.floor(release.duration_seconds / 60)}:{(release.duration_seconds % 60).toString().padStart(2, '0')}
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {/* Description */}
          {release.description && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {release.description}
              </Typography>
            </Box>
          )}

          {/* Streaming Links */}
          <StreamingLinkButtons streamingLinks={release.streaming_links} />

          {/* YouTube Video Embed */}
          <YouTubeEmbed 
            videoUrl={getYouTubeUrl(release.streaming_links)} 
            title={release.title}
          />
        </Box>
      </Box>

      {/* Navigation Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToReleases}
        >
          Back to Releases
        </Button>
      </Box>

      {/* Related Releases */}
      <RelatedReleases 
        currentReleaseId={release.id} 
        artists={release.artists}
      />
    </Container>
  );
};

export default ReleaseDetailPage;