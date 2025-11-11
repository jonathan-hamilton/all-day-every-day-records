import { Typography, Box, Card, CardContent, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Releases() {
  const navigate = useNavigate()

  // Sample release data for demonstration
  const sampleReleases = [
    { id: 'street-stories', title: 'Street Stories', artist: 'MC Underground', year: '2025' },
    { id: 'urban-legends', title: 'Urban Legends', artist: 'The Collective', year: '2025' },
    { id: 'raw-truth', title: 'Raw Truth', artist: 'Lyrical Genius', year: '2024' },
  ]

  return (
    <Box>
      <Typography variant="h2" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
        Music Releases
      </Typography>
      
      <Typography 
        variant="h6" 
        color="text.secondary" 
        sx={{ mb: 4, textAlign: 'center' }}
      >
        Explore our catalog of groundbreaking rap and hip-hop releases
      </Typography>

      <Box 
        sx={{ 
          display: 'grid', 
          gap: 3, 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          mb: 4
        }}
      >
        {sampleReleases.map((release) => (
          <Card key={release.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
                {release.title}
              </Typography>
              <Typography variant="h6" color="secondary" sx={{ mb: 1 }}>
                {release.artist}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                Released: {release.year}
              </Typography>
              <Button 
                variant="contained"
                color="primary"
                onClick={() => navigate(`/releases/${release.id}`)}
                sx={{ mt: 'auto' }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          From emerging artists to established legends, discover your next favorite track.
        </Typography>
      </Box>
    </Box>
  )
}