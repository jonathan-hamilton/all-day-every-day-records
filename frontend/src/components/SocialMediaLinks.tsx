/**
 * Social Media Links Component
 * 
 * Displays social media icons for a release with conditional rendering.
 * Only shows icons for platforms that have configured URLs.
 * Uses custom PNG icons from public/images/ folder.
 */
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

interface SocialMediaLinksProps {
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  twitterUrl
}) => {
  // Don't render anything if no social media URLs are provided
  const hasAnySocialMedia = instagramUrl || facebookUrl || tiktokUrl || twitterUrl;
  
  if (!hasAnySocialMedia) {
    return null;
  }

  const socialMediaPlatforms = [
    {
      name: 'Instagram',
      url: instagramUrl,
      icon: '/images/instagram-new.png',
      color: '#E4405F' // Instagram brand color for hover
    },
    {
      name: 'Facebook',
      url: facebookUrl,
      icon: '/images/facebook-new.png',
      color: '#1877F2' // Facebook brand color for hover
    },
    {
      name: 'TikTok',
      url: tiktokUrl,
      icon: '/images/tiktok--v2.png',
      color: '#000000' // TikTok brand color for hover
    },
    {
      name: 'Twitter',
      url: twitterUrl,
      icon: '/images/twitterx--v2.png',
      color: '#000000' // X/Twitter brand color for hover
    }
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        flexWrap: 'wrap',
        mt: 2
      }}
      role="navigation"
      aria-label="Social media links"
    >
      {socialMediaPlatforms.map((platform) => {
        // Only render if URL exists
        if (!platform.url) return null;

        return (
          <Tooltip key={platform.name} title={`Follow on ${platform.name}`} arrow>
            <IconButton
              component="a"
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${platform.name} page`}
              sx={{
                padding: 0,
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  filter: 'brightness(1.2)'
                },
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }
              }}
            >
              <img 
                src={platform.icon} 
                alt={`${platform.name} icon`}
                loading="lazy"
              />
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default SocialMediaLinks;
