import React, { useState, useEffect, useMemo } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useDebounce } from '../hooks/useDebounce';
import { createServices } from '../services';
import type { ReleaseOverview } from '../types';

interface ReleaseAutocompleteProps {
  onSelectRelease: (release: ReleaseOverview) => void;
  placeholder?: string;
  size?: 'small' | 'medium';
}

/**
 * Autocomplete search component for releases
 * Searches all published releases by artist name and title
 * Displays results with thumbnail, artist, and title
 */
export const ReleaseAutocomplete: React.FC<ReleaseAutocompleteProps> = ({
  onSelectRelease,
  placeholder = 'Search releases...',
  size = 'medium'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [allReleases, setAllReleases] = useState<ReleaseOverview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input to avoid excessive filtering
  const debouncedSearch = useDebounce(inputValue, 300);

  // Create services using factory pattern
  const services = useMemo(() => createServices(), []);

  // Fetch all releases on mount
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await services.releases.getReleases({ status: 'published' });
        setAllReleases(data);
      } catch (err) {
        console.error('Error fetching releases:', err);
        setError('Failed to load releases');
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [services.releases]);

  // Filter releases based on debounced search
  const filteredReleases = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return [];
    }

    const searchLower = debouncedSearch.toLowerCase();
    return allReleases.filter(release => {
      const titleMatch = release.title.toLowerCase().includes(searchLower);
      const artistMatch = release.artists_with_roles?.toLowerCase().includes(searchLower) || false;
      return titleMatch || artistMatch;
    });
  }, [debouncedSearch, allReleases]);

  return (
    <Autocomplete
      freeSolo
      options={filteredReleases}
      inputValue={inputValue}
      onInputChange={(_, newValue) => setInputValue(newValue)}
      onChange={(_, value) => {
        if (value && typeof value !== 'string') {
          onSelectRelease(value);
          setInputValue(''); // Clear input after selection
        }
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return `${option.artists_with_roles || 'Unknown Artist'} - ${option.title}`;
      }}
      loading={loading}
      noOptionsText={
        loading ? 'Loading...' : 
        error ? error :
        inputValue.trim() ? 'No releases found' : 'Start typing to search...'
      }
      ListboxProps={{
        sx: {
          maxHeight: 400,
          overflow: 'auto'
        },
        role: 'listbox',
        'aria-label': 'Release search results'
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size={size}
          placeholder={placeholder}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            'aria-label': 'Search releases by artist or title',
            'aria-autocomplete': 'list',
            'aria-controls': params.id ? `${params.id}-listbox` : undefined,
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'white' }} aria-hidden="true" />,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} aria-label="Loading results" /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& input': {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1
                }
              },
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.7)'
              }
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
        return (
          <li 
            key={key} 
            {...otherProps}
            role="option"
            aria-label={`${option.artists_with_roles || 'Unknown Artist'} - ${option.title}`}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                width: '100%',
                py: 1
              }}
            >
              {/* Thumbnail */}
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  flexShrink: 0,
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: 'grey.800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {option.cover_image_url ? (
                  <img
                    src={option.cover_image_url}
                    alt={option.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <SearchIcon sx={{ color: 'grey.600' }} />
                )}
              </Box>

              {/* Artist - Title */}
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {option.artists_with_roles || 'Unknown Artist'}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {option.title}
                </Typography>
              </Box>
            </Box>
          </li>
        );
      }}
      PaperComponent={({ children, ...other }) => (
        <Paper
          {...other}
          sx={{
            mt: 1,
            boxShadow: 3,
            backgroundColor: '#424242',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '& .MuiAutocomplete-listbox': {
              backgroundColor: 'transparent'
            },
            '& .MuiAutocomplete-option': {
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              },
              '&[aria-selected="true"]': {
                backgroundColor: 'rgba(255, 255, 255, 0.16)'
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)'
              }
            },
            '& .MuiAutocomplete-noOptions': {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }}
        >
          {children}
        </Paper>
      )}
    />
  );
};

export default ReleaseAutocomplete;
