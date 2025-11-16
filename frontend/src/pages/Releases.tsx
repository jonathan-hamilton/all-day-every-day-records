import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Typography, 
  Box,
  Container,
  Skeleton,
  Alert,
  Button
} from '@mui/material';
import { createServices } from '../services';
import { ReleaseCard } from '../components/ReleaseCard';
import { ReleaseFilters, type FilterState } from '../components/ReleaseFilters';
import { useDebounce } from '../hooks/useDebounce';
import type { ReleaseOverview } from '../types';

export default function Releases() {
  const [releases, setReleases] = useState<ReleaseOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    releaseType: '',
    sortBy: 'release_date',
    sortOrder: 'desc'
  });

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 300);

  // Create services using factory pattern - memoize to prevent re-creation
  const services = useMemo(() => createServices(), []);

  // Fetch releases with current filters
  const fetchReleases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        status: 'published' as const,
        sort: filters.sortBy,
        order: filters.sortOrder,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.releaseType && { release_type: filters.releaseType })
      };

      const data = await services.releases.getReleases(params);
      setReleases(data);
    } catch (err) {
      console.error('Error fetching releases:', err);
      setError('Failed to load releases. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.releaseType, filters.sortBy, filters.sortOrder, services.releases]);

  // Effect to fetch releases when filters change
  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Handle retry on error
  const handleRetry = () => {
    fetchReleases();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Music Releases
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Explore our catalog of groundbreaking rap and hip-hop releases from emerging artists to established legends
        </Typography>
      </Box>

      {/* Filters */}
      <ReleaseFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        resultCount={releases.length}
        isLoading={loading}
      />

      {/* Error State */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: 'repeat(1, 1fr)', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            },
            gap: 3
          }}
        >
          {[...Array(8)].map((_, index) => (
            <Box key={index}>
              <Skeleton variant="rectangular" height={250} sx={{ mb: 2 }} />
              <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Releases Grid */}
      {!loading && !error && (
        <>
          {releases.length > 0 ? (
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: 'repeat(1, 1fr)', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)', 
                  lg: 'repeat(4, 1fr)' 
                },
                gap: 3
              }}
            >
              {releases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                No releases found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search or filter criteria
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => handleFiltersChange({
                  search: '',
                  releaseType: '',
                  sortBy: 'release_date',
                  sortOrder: 'desc'
                })}
              >
                Clear all filters
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Footer Message */}
      {!loading && !error && releases.length > 0 && (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Discover your next favorite track from our growing collection of authentic hip-hop music
          </Typography>
        </Box>
      )}
    </Container>
  );
}