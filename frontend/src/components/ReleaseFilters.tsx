import React from 'react';
import {
  Box,
  TextField,
  Chip,
  Typography,
  Button
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

export interface FilterState {
  search: string;
  releaseType: string;
  sortBy: 'release_date' | 'title' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

interface ReleaseFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
  isLoading: boolean;
}

export const ReleaseFilters: React.FC<ReleaseFiltersProps> = ({
  filters,
  onFiltersChange,
  resultCount,
  isLoading
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: event.target.value
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      releaseType: '',
      sortBy: 'release_date',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.search;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Search and Result Count */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Title or Artist"
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'white' }} />,
            }}
            sx={{ 
              maxWidth: { xs: '100%', sm: 260 },
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
              }
            }}
          />
        </Box>
        
        {/* Result Count and Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {isLoading ? 'Loading...' : `${resultCount} release${resultCount !== 1 ? 's' : ''} found`}
          </Typography>
          
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<ClearIcon sx={{ color: 'white' }} />}
              onClick={handleClearFilters}
              sx={{ 
                fontSize: '0.8rem',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              Clear all filters
            </Button>
          )}
        </Box>
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
            Active filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.search && (
              <Chip 
                label={`Search: "${filters.search}"`} 
                size="small"
                onDelete={() => onFiltersChange({ ...filters, search: '' })}
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ReleaseFilters;