import { JSX, useEffect, useState, useMemo, useCallback } from "react";
import { Typography, Box, Container, Grid } from "@mui/material";
import { Release } from "../types/Release";
import ReleaseTile from "../pages/ReleaseTile";
import ReleaseFilters from "./ReleaseFilters";
import { filterBySearch } from "../utils/formatUtils";
import { useDebounce } from "../hooks/useDebounce";

interface ReleasesApiResponse {
  success: boolean;
  releases: Release[];
}

interface ReleasesGridProps {
  labelFilter?: string;
  pageTitle: string;
}

export default function ReleasesGrid({ labelFilter, pageTitle }: ReleasesGridProps): JSX.Element {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered releases
  const filteredReleases = useMemo(() => {
    let filtered = releases;

    // Apply label filter (existing functionality)
    if (labelFilter) {
      filtered = filtered.filter(release => 
        release.label?.includes(labelFilter)
      );
    }

    // Apply search filter
    filtered = filterBySearch(filtered, debouncedSearchTerm);

    // Sort alphabetically by artist
    return filtered.sort((a, b) => a.artist.localeCompare(b.artist));
  }, [releases, labelFilter, debouncedSearchTerm]);

  // Filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
  }, []);

  useEffect(() => {
    // Always use production API for real data
    const productionUrl = "https://nickelanddimerecords.com/api/get-releases.php";
    
    const fetchReleases = async () => {
      try {
        const response = await fetch(productionUrl);
        
        const data: ReleasesApiResponse = await response.json();
        
        if (data.success && Array.isArray(data.releases)) {
          // Store all releases (filtering will be done by memoized function)
          
          // Sort all releases alphabetically by artist for consistent ordering
          const sortedReleases = data.releases.sort((a, b) => 
            a.artist.localeCompare(b.artist)
          );
          setReleases(sortedReleases);
        } else {
          console.error("Invalid data format:", data);
        }
        setLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching releases:", err);
        setLoading(false);
      }
    };
    
    fetchReleases();
  }, []); // Remove labelFilter dependency since we handle filtering in memoized function

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="left" gutterBottom>
          {pageTitle}
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          Loading releases...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="left" gutterBottom>
        {pageTitle}
      </Typography>
      
      {/* Release Filters */}
      {releases.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <ReleaseFilters
            searchTerm={searchTerm}
            resultCount={filteredReleases.length}
            totalCount={releases.filter(release => 
              labelFilter ? release.label?.includes(labelFilter) : true
            ).length}
            onSearchChange={handleSearchChange}
            onClearFilters={handleClearFilters}
          />
        </Box>
      )}
      
      {filteredReleases.length === 0 && releases.length > 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            mt: 8, 
            mb: 8,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            p: 4
          }}
        >
          <Typography variant="h6" gutterBottom>
            No releases found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : filteredReleases.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            mt: 8, 
            mb: 8,
            textAlign: 'center',
            minHeight: '300px'
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 300,
              color: 'text.secondary',
              mb: 2
            }}
          >
            No releases found
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              opacity: 0.7,
              maxWidth: '400px'
            }}
          >
            There are currently no releases available for this label.
          </Typography>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center">
          <Grid container spacing={4} justifyContent="center" maxWidth="lg">
            {filteredReleases.map((release: Release) => (
              <Grid
                // @ts-expect-error - MUI Grid typing issue with 'item' prop
                item
                key={release.id}
                component="div"
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <ReleaseTile
                  id={release.id.toString()}
                  imageUrl={release.cover_image_url}
                  artist={release.artist}
                  title={release.title}
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}