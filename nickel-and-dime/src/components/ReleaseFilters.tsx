import { Box, TextField, Button, Typography } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface ReleaseFiltersProps {
  searchTerm: string;
  resultCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function ReleaseFilters({
  searchTerm,
  resultCount,
  totalCount,
  onSearchChange,
  onClearFilters,
}: ReleaseFiltersProps) {
  const hasActiveFilters = searchTerm !== '';

  return (
    <Box>
      {/* Filter Controls */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 2,
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' }
      }}>
        {/* Search Input */}
        <TextField
          variant="outlined"
          placeholder="Search by Artist or Title"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          sx={{ 
            width: { xs: '100%', md: '360px' },
            backgroundColor: 'white'
          }}
        />

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={onClearFilters}
            sx={{ 
              whiteSpace: 'nowrap',
              minWidth: 'auto'
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary">
        Showing {resultCount} of {totalCount} releases
        {hasActiveFilters && (
          <Typography component="span" sx={{ fontStyle: 'italic', ml: 1 }}>
            (filtered)
          </Typography>
        )}
      </Typography>
    </Box>
  );
}