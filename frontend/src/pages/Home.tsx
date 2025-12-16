import { Box, Typography, CircularProgress, Container } from '@mui/material'
import { Album as AlbumIcon } from '@mui/icons-material'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ReleaseCarousel from '../components/ReleaseCarousel'
import ReleaseCard from '../components/ReleaseCard'
import HomepageVideoGrid from '../components/HomepageVideoGrid'
import ReleaseAutocomplete from '../components/ReleaseAutocomplete'
import { createServices } from '../services'
import type { ReleaseOverview } from '../types'

export default function Home() {
  const [featuredReleases, setFeaturedReleases] = useState<ReleaseOverview[]>([])
  const [loading, setLoading] = useState(true)
  const services = useMemo(() => createServices(), [])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeaturedReleases = async () => {
      try {
        setLoading(true)
        // Fetch all releases and filter by 'New' tag
        const allReleases = await services.releases.getReleases({ status: 'published' })
        const featured = allReleases.filter(release => release.tag === 'New').slice(0, 2)
        setFeaturedReleases(featured)
      } catch (error) {
        console.error('Failed to fetch featured releases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedReleases()
  }, [services.releases])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
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
        Home
      </Typography>

      {/* Search Box with Background */}
      <Box 
        sx={{ 
          p: 3, 
          mb: 4,
          backgroundImage: 'url(/images/abstract-black-grunge-texture-scaled-900x120.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          borderRadius: 1,
          border: '1px solid rgba(255, 255, 255, 0.12)',
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
        {/* S4.1 Search Autocomplete */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 260 } }}>
              <ReleaseAutocomplete
                onSelectRelease={(release) => navigate(`/releases/${release.id}`)}
                placeholder="Title or Artist"
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* New Releases Section */}
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1,
          mb: 4,
          pt: 2,
          textAlign: 'center',
          color: 'white'
        }}
      >
        <AlbumIcon fontSize="large" />
        New Releases
      </Typography>
        
      {loading ? (
        <Box sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 3,
          px: 2,
          mb: 6,
          flexWrap: 'wrap'
        }}>
          {featuredReleases.map((release) => (
            <Box key={release.id} sx={{ width: { xs: '100%', sm: '58.5%', md: '390px' }, maxWidth: '520px' }}>
              <ReleaseCard release={release} />
            </Box>
          ))}
        </Box>
      )}

      {/* S2.1 Homepage Featured Releases Carousel */}
      <Box sx={{ pt: 6, pb: 0 }}>
        <Typography 
          variant="h4" 
          component="h2" 
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
          <AlbumIcon fontSize="large" />
          Featured Releases
        </Typography>
      </Box>
      <ReleaseCarousel 
        maxSlides={8}
        autoPlay={true}
        autoPlayInterval={5000}
        showNavigation={true}
        showIndicators={true}
        tag="Featured"
      />

      {/* S2.4 Homepage YouTube Video Grid */}
      <HomepageVideoGrid 
        maxVideos={4}
        showTitle={true}
      />
    </Container>
  )
}