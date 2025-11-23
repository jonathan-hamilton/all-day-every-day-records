/**
 * Release Carousel Slide Component
 * 
 * Individual slide component for the featured releases carousel.
 * Displays release cover image, title, artist information, release date, 
 * and label with responsive design using Material-UI components.
 */
import React from 'react';
import { 
  Box,
  useTheme 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ReleaseCarouselSlide as ReleaseCarouselSlideType } from '../types';

interface ReleaseCarouselSlideProps {
  release: ReleaseCarouselSlideType;
  onClick?: (release: ReleaseCarouselSlideType) => void;
}

export const ReleaseCarouselSlide: React.FC<ReleaseCarouselSlideProps> = ({ 
  release, 
  onClick 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Handle click navigation
  const handleClick = () => {
    if (onClick) {
      onClick(release);
    } else {
      // Navigate to release detail page using slug
      navigate(`/releases/${release.slug}`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // Fallback image URL
  const coverImageUrl = release.cover_image_url || '/images/default-cover.svg';

  return (
    <Box
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 0, // Square corners
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: '2px',
        }
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${release.title} by ${release.artists_with_roles || 'Unknown Artist'}`}
    >
      {/* Cover Image - Full Container */}
      <Box
        component="img"
        sx={{ 
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          backgroundColor: theme.palette.grey[100]
        }}
        src={coverImageUrl}
        alt={`${release.title} cover art`}
        onError={(e) => {
          // Fallback to default image on error, prevent infinite loop
          const target = e.target as HTMLImageElement;
          if (target.src.includes('default-cover.svg')) {
            // Use a data URL as final fallback to prevent network requests
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
          } else {
            target.src = '/images/default-cover.svg';
          }
        }}
      />
    </Box>
  );
};

export default ReleaseCarouselSlide;