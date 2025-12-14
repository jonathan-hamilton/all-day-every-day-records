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
    <Box sx={{ textAlign: 'center' }}>
      {/* S4.1 Search Autocomplete */}
      <Container maxWidth="sm" sx={{ pt: 4, pb: 4 }}>
        <ReleaseAutocomplete
          onSelectRelease={(release) => navigate(`/releases/${release.id}`)}
          placeholder="Search by title or artist..."
        />
      </Container>

      {/* New Releases Section */}
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
      </Box>

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
    </Box>
  )
}