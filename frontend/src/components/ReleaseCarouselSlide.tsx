/**
 * Release Carousel Slide Component
 * 
 * Individual slide component for the featured releases carousel.
 * Displays release cover image, title, artist information, release date, 
 * and label with responsive design using Material-UI components.
 */
import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
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

  // Format release date for display
  const formatReleaseDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return '';
    }
  };

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
  const formattedDate = formatReleaseDate(release.release_date);

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
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
      {/* Cover Image */}
      <CardMedia
        component="img"
        sx={{ 
          height: 200,
          objectFit: 'cover',
          backgroundColor: theme.palette.grey[100]
        }}
        image={coverImageUrl}
        alt={`${release.title} cover art`}
        onError={(e) => {
          // Fallback to default image on error
          const target = e.target as HTMLImageElement;
          target.src = '/images/default-cover.svg';
        }}
      />

      {/* Content Section */}
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: 2,
        '&:last-child': { 
          pb: 2 
        }
      }}>
        
        {/* Release Title */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 'bold',
            mb: 1,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.4em'
          }}
        >
          {release.title}
        </Typography>

        {/* Artist Information */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 1,
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.4em'
          }}
        >
          {release.artists_with_roles || 'Unknown Artist'}
        </Typography>

        {/* Release Metadata */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 1,
          mt: 'auto'
        }}>
          
          {/* Release Type Chip */}
          <Box>
            <Chip 
              label={release.release_type.toUpperCase()} 
              size="small"
              variant="outlined"
              sx={{ 
                fontSize: '0.75rem',
                height: 24,
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
            />
          </Box>

          {/* Bottom Row: Date and Label */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 0.5
          }}>
            
            {/* Release Date */}
            {formattedDate && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.75rem',
                  lineHeight: 1
                }}
              >
                {formattedDate}
              </Typography>
            )}

            {/* Label Name */}
            {release.label_name && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textAlign: 'right',
                  lineHeight: 1
                }}
              >
                {release.label_name}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReleaseCarouselSlide;