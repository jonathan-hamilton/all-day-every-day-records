/**
 * Videos Page Component
 * 
 * Displays a comprehensive grid of all available videos.
 * Fetches from dedicated videos endpoint and navigates to detail pages on click.
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Container
} from '@mui/material'
import { PlayCircleFilled as PlayIcon, Search as SearchIcon } from '@mui/icons-material'
import { createServices } from '../services'
import type { Video } from '../types'
import VideoGridItem from '../components/VideoGridItem'
import { AlphabeticalNav } from '../components'

interface VideoState {
  loading: boolean
  error: string | null
  videos: Video[]
}

export default function Videos() {
  const services = useMemo(() => createServices(), [])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeLetter, setActiveLetter] = useState<string>('')
  const [state, setState] = useState<VideoState>({
    loading: true,
    error: null,
    videos: []
  })

  // Refs for letter sections
  const letterRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        // Fetch from dedicated videos endpoint (sorted by artist, then title)
        const videos = await services.videos.getVideos()

        // Sort alphabetically by artist name
        const sortedVideos = [...videos].sort((a, b) => {
          const artistA = a.artist || 'Unknown';
          const artistB = b.artist || 'Unknown';
          return artistA.localeCompare(artistB);
        });

        setState({
          loading: false,
          error: null,
          videos: sortedVideos
        })
      } catch (error) {
        console.error('Failed to fetch videos:', error)
        setState({
          loading: false,
          error: 'Unable to load videos. Please check your connection.',
          videos: []
        })
      }
    }

    fetchVideos()
  }, [services.videos])

  // Filter videos based on search term
  const filteredVideos = useMemo(() => {
    if (!searchTerm.trim()) {
      return state.videos
    }
    
    const lowerSearch = searchTerm.toLowerCase()
    return state.videos.filter(video => 
      video.title.toLowerCase().includes(lowerSearch) ||
      video.artist.toLowerCase().includes(lowerSearch)
    )
  }, [state.videos, searchTerm])

  // Group videos by first letter of artist name
  const groupedVideos = useMemo(() => {
    const grouped: Record<string, Video[]> = {};
    
    filteredVideos.forEach((video) => {
      const firstLetter = video.artist.charAt(0).toUpperCase();
      // Handle non-alphabetic characters
      const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
      
      if (!grouped[letter]) {
        grouped[letter] = [];
      }
      grouped[letter].push(video);
    });
    
    return grouped;
  }, [filteredVideos]);

  // Calculate available letters (sorted alphabetically)
  const availableLetters = useMemo(() => {
    return Object.keys(groupedVideos)
      .filter(letter => letter !== '#') // Exclude special characters
      .sort();
  }, [groupedVideos]);

  // Handle letter click - filter by letter (toggle on/off)
  const handleLetterClick = useCallback((letter: string) => {
    setActiveLetter(prev => prev === letter ? '' : letter);
  }, []);

  // Track active letter based on scroll position
  useEffect(() => {
    if (availableLetters.length === 0) return;

    const observers: IntersectionObserver[] = [];
    
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -80% 0px', // Trigger when section enters top 20%
      threshold: 0
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const letter = entry.target.getAttribute('data-letter');
          if (letter) {
            setActiveLetter(letter);
          }
        }
      });
    };
    
    Object.entries(letterRefs.current).forEach(([, element]) => {
      if (element) {
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(element);
        observers.push(observer);
      }
    });
    
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [availableLetters]);

  // Loading state
  if (state.loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1,
              mb: 4,
              color: 'white'
            }}
          >
            <PlayIcon fontSize="large" />
            Videos
          </Typography>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ mt: 2, color: 'white' }}>
            Loading videos...
          </Typography>
        </Box>
      </Container>
    )
  }

  // Error state
  if (state.error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            mb: 4,
            color: 'white'
          }}
        >
          <PlayIcon fontSize="large" />
          Videos
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      </Container>
    )
  }

  // Empty state
  if (state.videos.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1,
              mb: 4,
              color: 'white'
            }}
          >
            <PlayIcon fontSize="large" />
            Videos
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            No videos available at this time.
          </Typography>
        </Box>
      </Container>
    )
  }

  // Render search and results
  const hasVideos = state.videos.length > 0
  const hasFilteredResults = filteredVideos.length > 0

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1,
          mb: 4,
          textAlign: 'center',
          color: 'white'
        }}
      >
        <PlayIcon fontSize="large" />
        Videos
      </Typography>

      {hasVideos && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Title or Artist"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
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
          <Typography variant="body2" sx={{ color: 'white' }}>
            {(() => {
              const count = filteredVideos.filter(video => {
                if (!activeLetter) return true;
                const artistName = video.artist || 'Unknown';
                const firstLetter = artistName.charAt(0).toUpperCase();
                const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
                return letter === activeLetter;
              }).length;
              return `${count} video${count !== 1 ? 's' : ''} found`;
            })()}
          </Typography>
        </Box>
      )}

      {!hasFilteredResults && searchTerm && (
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 3
          }}
        >
          No videos found matching "{searchTerm}"
        </Typography>
      )}

      {hasFilteredResults && (
        <>
          {/* Alphabetical Navigation */}
          <AlphabeticalNav
            availableLetters={availableLetters}
            activeLetter={activeLetter}
            onLetterClick={handleLetterClick}
          />

          {/* All Videos in Alphabetical Order */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: 3
            }}
          >
            {filteredVideos
              .filter(video => {
                if (!activeLetter) return true;
                const artistName = video.artist || 'Unknown';
                const firstLetter = artistName.charAt(0).toUpperCase();
                const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
                return letter === activeLetter;
              })
              .map((video) => (
                <VideoGridItem key={video.id} video={video} />
              ))}
          </Box>
        </>
      )}
    </Container>
  )
}
