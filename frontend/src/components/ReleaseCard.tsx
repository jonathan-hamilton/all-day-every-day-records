import React from 'react';
import { 
  Box, 
  Typography
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReleaseOverview } from '../types';

interface ReleaseCardProps {
  release: ReleaseOverview;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({ release }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate(`/releases/${release.id}`, { state: { from: location.pathname } });
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 0,
        minWidth: 0,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        }
      }}
      onClick={handleClick}
    >
      {/* Cover Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingBottom: '100%', // Creates 1:1 aspect ratio
          backgroundColor: '#000',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <Box
          component="img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'fill',
            display: 'block'
          }}
          src={release.cover_image_url || '/images/nd-releases/default-cover.jpg'}
          alt={`${release.title} cover art`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('default-cover.jpg')) {
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
            } else {
              target.src = '/images/nd-releases/default-cover.jpg';
            }
          }}
        />
      </Box>
      
      {/* Release Title - Auto-sized grey box */}
      <Box
        sx={{
          backgroundImage: 'url(/images/title-inverse.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: 0.75,
          textAlign: 'left',
          display: 'inline-block',
          width: 'fit-content',
          maxWidth: '100%',
          marginBottom: '2px'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'black',
            fontWeight: 'medium',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {release.title}
        </Typography>
      </Box>

      {/* Release Artist - Auto-sized grey box */}
      <Box
        sx={{
          backgroundImage: 'url(/images/title-inverse.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: 0.75,
          textAlign: 'left',
          display: 'inline-block',
          width: 'fit-content',
          maxWidth: '100%'
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'black',
            fontWeight: 'medium',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {release.artists_with_roles || 'Unknown Artist'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ReleaseCard;