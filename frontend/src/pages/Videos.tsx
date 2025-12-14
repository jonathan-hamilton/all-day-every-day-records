/**
 * Videos Page Component
 * 
 * Displays a comprehensive grid of all available videos.
 * Fetches from dedicated videos endpoint and navigates to detail pages on click.
 */

import { useState, useEffect, useMemo } from 'react'
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

interface VideoState {
  loading: boolean
  error: string | null
  videos: Video[]
}

export default function Videos() {
  const services = useMemo(() => createServices(), [])
  const [searchTerm, setSearchTerm] = useState('')
  const [state, setState] = useState<VideoState>({
    loading: true,
    error: null,
    videos: []
  })

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        // Fetch from dedicated videos endpoint (sorted by artist, then title)
        const videos = await services.videos.getVideos()

        setState({
          loading: false,
          error: null,
          videos: videos
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
        <Box 
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundImage: 'url("/images/abstract-black-grunge-texture-scaled-900x120.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: 'inherit',
              zIndex: 1,
              pointerEvents: 'none'
            },
            '& > *': {
              position: 'relative',
              zIndex: 2
            }
          }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by title or artist..."
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
                maxWidth: { xs: '100%', sm: 400 },
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
            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
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
          {filteredVideos.map((video) => (
            <VideoGridItem key={video.id} video={video} />
          ))}
        </Box>
      )}
    </Container>
  )
}
