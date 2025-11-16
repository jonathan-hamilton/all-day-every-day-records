import { Typography, Box, Button, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ReleaseCarousel from '../components/ReleaseCarousel'
import HomepageVideoGrid from '../components/HomepageVideoGrid'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography 
        variant="h1" 
        component="h1" 
        sx={{ 
          mb: 2,
          background: 'linear-gradient(45deg, #212121, #ff6b35)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        ALL DAY EVERY DAY RECORDS
      </Typography>
      
      <Typography variant="h4" color="text.secondary" sx={{ mb: 4 }}>
        The Premier Destination for Cutting-Edge Rap & Hip-Hop
      </Typography>
      
      <Box sx={{ mb: 6, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => navigate('/releases')}
        >
          Explore Releases
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          size="large"
          onClick={() => navigate('/about')}
        >
          About Us
        </Button>
      </Box>

      {/* S2.1 Homepage New Releases Carousel */}
      <ReleaseCarousel 
        maxSlides={8}
        autoPlay={true}
        autoPlayInterval={5000}
        showNavigation={true}
        showIndicators={true}
      />

      {/* S2.4 Homepage YouTube Video Grid */}
      <HomepageVideoGrid 
        maxVideos={4}
        showTitle={true}
      />

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, mt: 6 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              🎤 Discover Artists
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Uncover the next generation of rap and hip-hop talent from around the globe.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              🔥 Latest Releases
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stream the hottest tracks and albums from our growing catalog of artists.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              💯 Authentic Culture
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Experience genuine hip-hop culture with artists who keep it real.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}