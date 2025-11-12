import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ReleaseOverview } from '../types';

interface ReleaseCardProps {
  release: ReleaseOverview;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({ release }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/releases/${release.slug}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        }
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardMedia
          component="img"
          sx={{
            height: { xs: 200, sm: 250, md: 300 },
            objectFit: 'cover',
            backgroundColor: 'grey.300'
          }}
          image={release.cover_image_url || '/images/nd-releases/default-cover.jpg'}
          alt={`${release.title} cover art`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/nd-releases/default-cover.jpg';
          }}
        />
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 } }}>
          {/* Title */}
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              mb: 1, 
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {release.title}
          </Typography>

          {/* Artist */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {release.artists_with_roles || 'Various Artists'}
          </Typography>

          {/* Release Info */}
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {/* Release Type */}
              <Chip 
                label={release.release_type?.toUpperCase() || 'RELEASE'} 
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: '0.75rem',
                  height: 24,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  border: 'none'
                }}
              />
              
              {/* Featured Badge */}
              {release.is_featured && (
                <Chip 
                  label="FEATURED" 
                  size="small"
                  sx={{ 
                    fontSize: '0.75rem',
                    height: 24,
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText'
                  }}
                />
              )}
            </Box>

            {/* Date and Duration */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {formatDate(release.release_date)}
              </Typography>
              
              {release.duration_seconds && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {formatDuration(release.duration_seconds)}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ReleaseCard;