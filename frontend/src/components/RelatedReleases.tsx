import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { createServices } from '../services';
import { ReleaseCard } from './ReleaseCard';
import type { ReleaseOverview } from '../types/Release';
import type { ReleaseArtist } from '../types/Artist';

interface RelatedReleasesProps {
  currentReleaseId: number;
  artists: ReleaseArtist[];
}

interface RelatedReleasesState {
  loading: boolean;
  error: string | null;
  releases: ReleaseOverview[];
}

const RelatedReleases: React.FC<RelatedReleasesProps> = ({ currentReleaseId, artists }) => {
  const services = useMemo(() => createServices(), []);
  const [state, setState] = useState<RelatedReleasesState>({
    loading: true,
    error: null,
    releases: []
  });

  useEffect(() => {
    const fetchRelatedReleases = async () => {
      if (!artists || artists.length === 0) {
        setState({
          loading: false,
          error: null,
          releases: []
        });
        return;
      }

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Get releases by each artist (primary artist only for now)
        const primaryArtist = artists.find(artist => artist.role === 'primary') || artists[0];
        
        if (!primaryArtist) {
          setState({
            loading: false,
            error: null,
            releases: []
          });
          return;
        }

        // Use artist name instead of ID since our schema stores artist names directly
        const allReleases = await services.releases.getReleases({ 
          status: 'published',
          sort: 'release_date', 
          order: 'desc'
        });
        
        // Filter by artist name and exclude current release
        const artistReleases = allReleases
          .filter(release => {
            // Check if any of the release's artists match the primary artist name
            return release.artists_with_roles?.includes(primaryArtist.name) && release.id !== currentReleaseId;
          });

        setState({
          loading: false,
          error: null,
          releases: artistReleases
        });
      } catch (error) {
        console.error('Error fetching related releases:', error);
        setState({
          loading: false,
          error: 'Failed to load related releases',
          releases: []
        });
      }
    };

    fetchRelatedReleases();
  }, [currentReleaseId, artists, services.releases]);

  // Don't render if no artists
  if (!artists || artists.length === 0) {
    return null;
  }

  // Don't render anything if no artists
  if (!artists || artists.length === 0) {
    return null;
  }

  // Don't render anything if no artists
  if (!artists || artists.length === 0) {
    return null;
  }

  // Loading state
  if (state.loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{
          color: 'white',
          fontWeight: 600,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          More from {artists[0]?.name}
        </Typography>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Error state - don't render anything
  if (state.error) {
    return null;
  }

  // No related releases found - don't render anything
  if (state.releases.length === 0) {
    return null;
  }

  const primaryArtist = artists.find(artist => artist.role === 'primary') || artists[0];

  // Success state with related releases
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ 
        mb: 3,
        color: 'white',
        fontWeight: 600,
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        More from {primaryArtist.name}
      </Typography>
      
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(1, 1fr)', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: 3
        }}
      >
        {state.releases.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </Box>
    </Box>
  );
};

export default RelatedReleases;