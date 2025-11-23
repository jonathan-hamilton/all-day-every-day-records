/**
 * Release Carousel Component
 * 
 * Displays new releases in a responsive carousel format using Material-UI.
 * Shows releases marked with 'New' tag from the admin dashboard.
 * Implements auto-play, navigation controls, and responsive design following
 * the project's design patterns.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Button,
  useTheme, 
  useMediaQuery,
  Skeleton 
} from '@mui/material';
import { 
  ArrowBackIos as ArrowBackIosIcon, 
  ArrowForwardIos as ArrowForwardIosIcon 
} from '@mui/icons-material';
import { createServices } from '../services';
import type { ReleaseCarouselSlide as ReleaseSlideData } from '../types';
import ReleaseCarouselSlide from './ReleaseCarouselSlide';

interface ReleaseCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  maxSlides?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
  tag?: string; // Optional tag filter ('New', 'Featured', etc.)
}

export const ReleaseCarousel: React.FC<ReleaseCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 5000,
  maxSlides = 8,
  showNavigation = true,
  showIndicators = true,
  tag = 'New' // Default to 'New' releases
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // State management
  const [releases, setReleases] = useState<ReleaseSlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Memoize services to prevent re-creation
  const services = useMemo(() => createServices(), []);

  // Responsive slides per view calculation
  const slidesPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const totalSlides = releases.length;
  const maxSlideIndex = Math.max(0, totalSlides - slidesPerView);

  // Fetch new releases data
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        const releases = await services.releases.getReleasesForCarousel({ 
          limit: maxSlides, 
          tag: tag 
        });
        setReleases(releases);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load new releases';
        setError(errorMessage);
        console.error('Carousel error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [maxSlides, tag, services.releases]);

  // Retry function for error recovery
  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    
    const retryFetch = async () => {
      try {
        const releases = await services.releases.getReleasesForCarousel({ 
          limit: maxSlides, 
          tag: tag 
        });
        setReleases(releases);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load new releases';
        setError(errorMessage);
        console.error('Carousel retry error:', err);
      } finally {
        setLoading(false);
      }
    };

    retryFetch();
  }, [maxSlides, services.releases]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (totalSlides <= slidesPerView) return;
    setCurrentSlide(prev => prev >= maxSlideIndex ? 0 : prev + 1);
  }, [maxSlideIndex, totalSlides, slidesPerView]);

  const goToPrevious = useCallback(() => {
    if (totalSlides <= slidesPerView) return;
    setCurrentSlide(prev => prev <= 0 ? maxSlideIndex : prev - 1);
  }, [maxSlideIndex, totalSlides, slidesPerView]);

  const goToSlide = useCallback((slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex <= maxSlideIndex) {
      setCurrentSlide(slideIndex);
    }
  }, [maxSlideIndex]);

  // Touch/swipe handling for mobile devices
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && totalSlides > slidesPerView) {
      goToNext();
    } else if (isRightSwipe && totalSlides > slidesPerView) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (totalSlides <= slidesPerView) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(maxSlideIndex);
        break;
      default:
        break;
    }
  }, [goToPrevious, goToNext, goToSlide, maxSlideIndex, totalSlides, slidesPerView]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || totalSlides <= slidesPerView || loading) {
      return;
    }

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext, isHovered, totalSlides, slidesPerView, loading]);

  // Loading state
  if (loading) {
    return (
      <Box 
        sx={{ width: '100%', mb: 4 }}
        role="region"
        aria-label="Loading new releases"
        aria-live="polite"
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {Array.from({ length: slidesPerView }).map((_, index) => (
            <Box key={index} sx={{ 
              width: { xs: 280, md: 300 },
              flexShrink: 0
            }}>
              <Skeleton 
                variant="rectangular" 
                height={300} 
                sx={{ 
                  borderRadius: 2,
                  mb: 1 
                }} 
                aria-label={`Loading release ${index + 1}`}
              />
              <Skeleton variant="text" height={32} aria-label="Loading title" />
              <Skeleton variant="text" height={24} width="80%" aria-label="Loading artist" />
            </Box>
          ))}
        </Box>
        
        {/* Screen reader loading message */}
        <Typography sx={{ position: 'absolute', left: '-10000px' }}>
          Loading new releases, please wait...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ 
        width: '100%', 
        mb: 4, 
        textAlign: 'center',
        py: 4 
      }}
      role="region"
      aria-label="new releases error"
      aria-live="assertive"
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ fontWeight: 'bold' }}
        >
          new releases
        </Typography>
        <Typography 
          variant="body1" 
          color="error" 
          sx={{ mt: 2, mb: 3 }}
          role="alert"
        >
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRetry}
          sx={{ mt: 1 }}
          aria-describedby="retry-description"
        >
          Try Again
        </Button>
        <Typography 
          id="retry-description" 
          sx={{ position: 'absolute', left: '-10000px' }}
        >
          Click to retry loading new releases
        </Typography>
      </Box>
    );
  }

  // No releases state
  if (releases.length === 0) {
    return (
      <Box sx={{ 
        width: '100%', 
        mb: 4, 
        textAlign: 'center',
        py: 4 
      }}
      role="region"
      aria-label="No new releases available"
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ fontWeight: 'bold' }}
        >
          new releases
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No new releases available at this time.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Check back soon for new music!
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        mb: 4,
        position: 'relative',
        backgroundColor: 'black',
        py: 4,
        borderRadius: 2
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="new releases carousel"
      aria-live="polite"
      aria-describedby="carousel-description"
    >
      {/* Section Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        mb: 3
      }}>
      </Box>

      {/* Carousel Container */}
      <Box sx={{ 
        position: 'relative',
        overflow: 'hidden',
        mx: { xs: 2, md: 4 }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      >
        
        {/* Navigation Arrows */}
        {showNavigation && totalSlides > slidesPerView && (
          <>
            {/* Previous Arrow */}
            <IconButton
              onClick={goToPrevious}
              sx={{
                position: 'absolute',
                left: { xs: -16, md: -20 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: theme.shadows[2],
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow: theme.shadows[4],
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
                display: { xs: 'none', sm: 'flex' }
              }}
              aria-label="Previous slide"
              disabled={currentSlide === 0 && !autoPlay}
            >
              <ArrowBackIosIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
            </IconButton>

            {/* Next Arrow */}
            <IconButton
              onClick={goToNext}
              sx={{
                position: 'absolute',
                right: { xs: -16, md: -20 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: theme.shadows[2],
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow: theme.shadows[4],
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
                display: { xs: 'none', sm: 'flex' }
              }}
              aria-label="Next slide"
              disabled={currentSlide === maxSlideIndex && !autoPlay}
            >
              <ArrowForwardIosIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
            </IconButton>

            {/* Mobile Navigation Buttons */}
            <Box sx={{ 
              display: { xs: 'flex', sm: 'none' },
              position: 'absolute',
              bottom: -50,
              left: '50%',
              transform: 'translateX(-50%)',
              gap: 2
            }}>
              <IconButton
                onClick={goToPrevious}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  }
                }}
                aria-label="Previous slide"
                disabled={currentSlide === 0 && !autoPlay}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                onClick={goToNext}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  }
                }}
                aria-label="Next slide"
                disabled={currentSlide === maxSlideIndex && !autoPlay}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </>
        )}

        {/* Slides Container */}
        <Box sx={{
          display: 'flex',
          transition: 'transform 0.3s ease-in-out',
          transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
          gap: 2
        }}
        role="tabpanel"
        aria-label={`Slide ${currentSlide + 1} of ${maxSlideIndex + 1}`}
        >
          {releases.map((release, index) => (
            <Box
              key={`${release.id}-${index}`}
              sx={{
                width: `calc(${100 / slidesPerView}% - ${(2 * (slidesPerView - 1)) / slidesPerView}rem)`,
                flexShrink: 0,
                height: 540
              }}
              role="group"
              aria-label={`Release ${index + 1}: ${release.title}`}
            >
              <ReleaseCarouselSlide 
                release={release} 
                onClick={(clickedRelease) => {
                  // Optional: Handle slide click behavior
                  console.log('Clicked release:', clickedRelease.title);
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Slide Indicators */}
        {showIndicators && totalSlides > slidesPerView && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: { xs: 7, sm: 2 }, // Extra space on mobile for navigation buttons
            pb: { xs: 2, sm: 0 }
          }}>
            {Array.from({ length: maxSlideIndex + 1 }).map((_, index) => (
              <Box
                key={index}
                onClick={() => goToSlide(index)}
                sx={{
                  width: { xs: 12, md: 8 },
                  height: { xs: 12, md: 8 },
                  borderRadius: '50%',
                  backgroundColor: currentSlide === index 
                    ? theme.palette.primary.main 
                    : theme.palette.grey[300],
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  minWidth: { xs: 44, md: 'auto' }, // Minimum touch target for mobile
                  minHeight: { xs: 44, md: 'auto' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    backgroundColor: currentSlide === index 
                      ? theme.palette.primary.dark 
                      : theme.palette.grey[400],
                    transform: { xs: 'none', md: 'scale(1.2)' } // No transform on mobile
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: '2px',
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(index);
                  }
                }}
              >
                {/* Inner dot for better visual feedback */}
                <Box sx={{
                  width: { xs: 8, md: '100%' },
                  height: { xs: 8, md: '100%' },
                  borderRadius: '50%',
                  backgroundColor: 'inherit'
                }} />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Hidden description for screen readers */}
      <Typography 
        id="carousel-description" 
        sx={{ position: 'absolute', left: '-10000px' }}
        component="p"
      >
        Use arrow keys or swipe to navigate through {totalSlides} new releases. 
        Currently showing slide {currentSlide + 1} of {maxSlideIndex + 1}. 
        {autoPlay && !isHovered ? 'Auto-play is active.' : 'Auto-play is paused.'}
      </Typography>
    </Box>
  );
};

export default ReleaseCarousel;
