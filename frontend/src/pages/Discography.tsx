import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Typography, 
  Box,
  Container,
  Skeleton,
  Alert,
  Button
} from '@mui/material';
import { Album as AlbumIcon } from '@mui/icons-material';
import { createServices } from '../services';
import { ReleaseCard, AlphabeticalNav } from '../components';
import { ReleaseFilters, type FilterState } from '../components/ReleaseFilters';
import { useDebounce } from '../hooks/useDebounce';
import type { ReleaseOverview } from '../types';

export default function Discography() {
  const [releases, setReleases] = useState<ReleaseOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLetter, setActiveLetter] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    releaseType: '',
    sortBy: 'release_date',
    sortOrder: 'desc'
  });

  // Refs for letter sections
  const letterRefs = useRef<Record<string, HTMLElement | null>>({});

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 300);

  // Create services using factory pattern - memoize to prevent re-creation
  const services = useMemo(() => createServices(), []);

  // Group releases by first letter of artist name
  const groupedReleases = useMemo(() => {
    const grouped: Record<string, ReleaseOverview[]> = {};
    
    releases.forEach((release) => {
      // Extract first artist name from artists_with_roles (format: "Artist Name (role)")
      const artistName = release.artists_with_roles?.split('(')[0].trim() || 'Unknown';
      const firstLetter = artistName.charAt(0).toUpperCase();
      // Handle non-alphabetic characters
      const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
      
      if (!grouped[letter]) {
        grouped[letter] = [];
      }
      grouped[letter].push(release);
    });
    
    return grouped;
  }, [releases]);

  // Calculate available letters (sorted alphabetically)
  const availableLetters = useMemo(() => {
    return Object.keys(groupedReleases)
      .filter(letter => letter !== '#') // Exclude special characters
      .sort();
  }, [groupedReleases]);

  // Fetch discography releases with current filters
  const fetchReleases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        status: 'published' as const,
        sort: 'release_date' as const,
        order: 'desc' as const,
        category: 'discography' as const, // Filter for discography releases only
        ...(debouncedSearch && { search: debouncedSearch })
      };

      const data = await services.releases.getReleases(params);
      
      // Sort alphabetically by artist name
      const sortedData = [...data].sort((a, b) => {
        const artistA = a.artists_with_roles?.split('(')[0].trim() || 'Unknown';
        const artistB = b.artists_with_roles?.split('(')[0].trim() || 'Unknown';
        return artistA.localeCompare(artistB);
      });
      
      setReleases(sortedData);
    } catch (err) {
      console.error('Error fetching discography:', err);
      setError('Failed to load discography. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, services.releases]);

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

  // Handle letter click - filter by letter (toggle on/off)
  const handleLetterClick = useCallback((letter: string) => {
    setActiveLetter(prev => prev === letter ? '' : letter);
  }, []);

  // Track active letter based on scroll position
  useEffect(() => {
    if (availableLetters.length === 0) return;

    const observers: IntersectionObserver[] = [];
    
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -80% 0px', // Trigger when section enters top 20%
      threshold: 0
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const letter = entry.target.getAttribute('data-letter');
          if (letter) {
            setActiveLetter(letter);
          }
        }
      });
    };
    
    Object.entries(letterRefs.current).forEach(([, element]) => {
      if (element) {
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(element);
        observers.push(observer);
      }
    });
    
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [availableLetters]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Typography 
        variant="h3" 
        component="h1" 
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
        <AlbumIcon fontSize="large" />
        Discography
      </Typography>

      {/* Filters */}
      <ReleaseFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        resultCount={releases.filter(release => {
          if (!activeLetter) return true;
          const artistName = release.artists_with_roles?.split('(')[0].trim() || 'Unknown';
          const firstLetter = artistName.charAt(0).toUpperCase();
          const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
          return letter === activeLetter;
        }).length}
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

      {/* Discography Grid */}
      {!loading && !error && (
        <>
          {releases.length > 0 ? (
            <>
              {/* Alphabetical Navigation */}
              <AlphabeticalNav
                availableLetters={availableLetters}
                activeLetter={activeLetter}
                onLetterClick={handleLetterClick}
              />

              {/* All Releases in Alphabetical Order */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                  },
                  gridAutoRows: '1fr',
                  gap: 3
                }}
              >
                {releases
                  .filter(release => {
                    if (!activeLetter) return true;
                    const artistName = release.artists_with_roles?.split('(')[0].trim() || 'Unknown';
                    const firstLetter = artistName.charAt(0).toUpperCase();
                    const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
                    return letter === activeLetter;
                  })
                  .map((release) => (
                    <ReleaseCard key={release.id} release={release} />
                  ))}
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                No discography releases found
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
    </Container>
  );
}
