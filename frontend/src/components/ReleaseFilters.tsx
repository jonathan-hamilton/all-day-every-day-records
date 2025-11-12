import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material/Select';

export interface FilterState {
  search: string;
  releaseType: string;
  label: string;
  sortBy: 'release_date' | 'title' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

interface ReleaseFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
  isLoading: boolean;
  availableLabels: string[];
}

export const ReleaseFilters: React.FC<ReleaseFiltersProps> = ({
  filters,
  onFiltersChange,
  resultCount,
  isLoading,
  availableLabels
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: event.target.value
    });
  };

  const handleReleaseTypeChange = (event: SelectChangeEvent<string>) => {
    onFiltersChange({
      ...filters,
      releaseType: event.target.value
    });
  };

  const handleLabelChange = (event: SelectChangeEvent<string>) => {
    onFiltersChange({
      ...filters,
      label: event.target.value
    });
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const [sortBy, sortOrder] = event.target.value.split('_');
    onFiltersChange({
      ...filters,
      sortBy: sortBy as FilterState['sortBy'],
      sortOrder: sortOrder as FilterState['sortOrder']
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      releaseType: '',
      label: '',
      sortBy: 'release_date',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.search || filters.releaseType || filters.label;

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

      {/* Filter Controls */}
      <Box sx={{ 
        display: 'grid', 
        gap: 2, 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)' 
        } 
      }}>
        {/* Release Type Filter */}
        <FormControl size="small">
          <InputLabel>Release Type</InputLabel>
          <Select
            value={filters.releaseType}
            onChange={handleReleaseTypeChange}
            label="Release Type"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="ep">EP</MenuItem>
            <MenuItem value="album">Album</MenuItem>
            <MenuItem value="mixtape">Mixtape</MenuItem>
            <MenuItem value="compilation">Compilation</MenuItem>
          </Select>
        </FormControl>

        {/* Label Filter */}
        <FormControl size="small">
          <InputLabel>Label</InputLabel>
          <Select
            value={filters.label}
            onChange={handleLabelChange}
            label="Label"
          >
            <MenuItem value="">All Labels</MenuItem>
            {availableLabels.map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Options */}
        <FormControl size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={`${filters.sortBy}_${filters.sortOrder}`}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="release_date_desc">Newest First</MenuItem>
            <MenuItem value="release_date_asc">Oldest First</MenuItem>
            <MenuItem value="title_asc">Title A-Z</MenuItem>
            <MenuItem value="title_desc">Title Z-A</MenuItem>
            <MenuItem value="created_at_desc">Recently Added</MenuItem>
          </Select>
        </FormControl>
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
            {filters.releaseType && (
              <Chip 
                label={`Type: ${filters.releaseType}`} 
                size="small"
                onDelete={() => onFiltersChange({ ...filters, releaseType: '' })}
                variant="outlined"
              />
            )}
            {filters.label && (
              <Chip 
                label={`Label: ${filters.label}`} 
                size="small"
                onDelete={() => onFiltersChange({ ...filters, label: '' })}
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