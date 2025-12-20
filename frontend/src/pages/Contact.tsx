import { Box, Typography, Link } from '@mui/material'
import { Email as EmailIcon, MailOutline as MailOutlineIcon } from '@mui/icons-material'
import { CONTACT_INFO } from '../config/constants'

export default function Contact() {
  return (
    <Box sx={{ color: 'white', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, color: 'white' }}>
        Contact
      </Typography>

      {/* Email Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3,
        flexWrap: 'wrap'
      }}>
        <EmailIcon sx={{ fontSize: 28, color: '#9e9e9e' }} />
        <Link 
          href={`mailto:${CONTACT_INFO.email}`}
          sx={{ 
            color: 'white',
            fontSize: '1.1rem',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          {CONTACT_INFO.email}
        </Link>
      </Box>

      {/* PO Box Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <MailOutlineIcon sx={{ fontSize: 28, color: '#9e9e9e' }} />
        <Typography 
          variant="body1"
          sx={{ 
            color: 'white',
            fontSize: '1.1rem'
          }}
        >
          {CONTACT_INFO.poBox}
        </Typography>
      </Box>
    </Box>
  )
}