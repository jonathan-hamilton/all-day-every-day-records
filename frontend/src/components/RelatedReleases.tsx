import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
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

        const artistReleases = await services.releases.getReleasesByArtist(primaryArtist.id, 6);
        
        // Filter out the current release and limit to 4 related releases
        const relatedReleases = artistReleases
          .filter(release => release.id !== currentReleaseId)
          .slice(0, 4);

        setState({
          loading: false,
          error: null,
          releases: relatedReleases
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

  // Loading state
  if (state.loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          More from {artists[0]?.name}
        </Typography>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Error state
  if (state.error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          More from {artists[0]?.name}
        </Typography>
        <Alert severity="info">
          Unable to load related releases at this time.
        </Alert>
      </Box>
    );
  }

  // No related releases found
  if (state.releases.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          More from {artists[0]?.name}
        </Typography>
        <Alert severity="info">
          No other releases found from this artist.
        </Alert>
      </Box>
    );
  }

  const primaryArtist = artists.find(artist => artist.role === 'primary') || artists[0];

  // Success state with related releases
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
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