/**
 * Videos Page Component
 * 
 * Displays a comprehensive grid of all available videos.
 * Reuses VideoGridItem component for consistency with homepage.
 */

import { useState, useEffect, useMemo } from 'react'
import { 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  Grid
} from '@mui/material'
import { PlayCircleFilled as PlayIcon } from '@mui/icons-material'
import { createServices } from '../services'
import VideoGridItem from '../components/VideoGridItem'

interface Video {
  id: number
  title: string
  youtube_url: string
}

interface VideoState {
  loading: boolean
  error: string | null
  videos: Video[]
}

export default function Videos() {
  const services = useMemo(() => createServices(), [])
  const [state, setState] = useState<VideoState>({
    loading: true,
    error: null,
    videos: []
  })

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        // Temporarily fetch from homepage videos endpoint (S5.2 will create dedicated endpoint)
        const response = await services.api.get('/get-homepage-videos.php')
        
        // Handle API response format: {success: true, videos: [...]}
        const apiResponse = response as { success?: boolean; videos?: string[] }
        const videoUrls = apiResponse.videos || []
        
        // Convert URL array to video objects
        const videos: Video[] = Array.isArray(videoUrls) 
          ? videoUrls.map((url, index) => ({
              id: index + 1,
              title: `Video ${index + 1}`,
              youtube_url: url
            }))
          : []

        setState({
          loading: false,
          error: null,
          videos: videos.filter(v => v.youtube_url && v.youtube_url.trim() !== '')
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
  }, [services.api])

  // Loading state
  if (state.loading) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
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
    )
  }

  // Error state
  if (state.error) {
    return (
      <Box sx={{ py: 6 }}>
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
      </Box>
    )
  }

  // Empty state
  if (state.videos.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
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
    )
  }

  // Success state with video grid
  return (
    <Box sx={{ py: 6 }}>
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

      <Grid container spacing={3}>
        {state.videos.map((video) => (
          <Grid item xs={12} sm={6} md={6} key={video.id}>
            <VideoGridItem 
              videoUrl={video.youtube_url}
              title={video.title}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
