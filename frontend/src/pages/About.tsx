import { Box, Typography, Container } from '@mui/material'

export default function About() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4, color: 'white' }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ color: 'white' }}>
          About All Day Every Day Records
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: 'white', fontSize: '1.1rem' }}>
          We are a cutting-edge record label dedicated to promoting authentic rap and hip-hop culture.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: 'white', fontSize: '1.1rem' }}>
          Our mission is to discover, develop, and distribute the most innovative artists in the genre.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: 'white', fontSize: '1.1rem' }}>
          Founded on the principles of artistic integrity and cultural authenticity.
        </Typography>
      </Box>
    </Container>
  )
}