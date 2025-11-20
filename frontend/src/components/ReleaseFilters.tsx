import React from 'react';
import {
  Box,
  TextField,
  Chip,
  Typography,
  Button,
  Paper
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
    <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
      {/* Search and Result Count */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by title or artist..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ 
              maxWidth: { xs: '100%', sm: 400 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper'
              }
            }}
          />
        </Box>
        
        {/* Result Count and Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            {isLoading ? 'Loading...' : `${resultCount} release${resultCount !== 1 ? 's' : ''} found`}
          </Typography>
          
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{ fontSize: '0.8rem' }}
            >
              Clear all filters
            </Button>
          )}
        </Box>
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
    </Paper>
  );
};

export default ReleaseFilters;