import { Typography, Box } from '@mui/material'
import ReleaseCarousel from '../components/ReleaseCarousel'
import HomepageVideoGrid from '../components/HomepageVideoGrid'

export default function Home() {
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
    </Box>
  )
}