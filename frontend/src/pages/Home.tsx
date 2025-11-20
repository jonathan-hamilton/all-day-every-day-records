import { Box } from '@mui/material'
import ReleaseCarousel from '../components/ReleaseCarousel'
import HomepageVideoGrid from '../components/HomepageVideoGrid'

export default function Home() {
  return (
    <Box sx={{ textAlign: 'center' }}>
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