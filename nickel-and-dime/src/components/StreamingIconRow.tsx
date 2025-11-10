import { Box, Typography } from "@mui/material";

interface StreamingIconRowProps {
  links: {
    spotify?: string;
    apple?: string;
    amazon?: string;
    youtube?: string;
  };
}

export default function StreamingIconRow({ links }: StreamingIconRowProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Stream this!
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        {links.spotify && (
          <a href={links.spotify} target="_blank" rel="noopener noreferrer">
            <Box
              component="img"
              src="/images/icons8-spotify-logo-94.png"
              alt="Spotify"
              sx={{ width: 56.4, height: 56.4 }} // 20% increase from 47
            />
          </a>
        )}
        {links.apple && (
          <a href={links.apple} target="_blank" rel="noopener noreferrer">
            <Box
              component="img"
              src="/images/icons8-apple-logo-94.png"
              alt="Apple Music"
              sx={{ width: 56.4, height: 56.4 }}
            />
          </a>
        )}
        {links.amazon && (
          <a href={links.amazon} target="_blank" rel="noopener noreferrer">
            <Box
              component="img"
              src="/images/icons8-amazon-music-96.png"
              alt="Amazon Music"
              sx={{ width: 57.6, height: 57.6 }}
            />
          </a>
        )}
        {links.youtube && (
          <a href={links.youtube} target="_blank" rel="noopener noreferrer">
            <Box
              component="img"
              src="/images/icons8-youtube-logo-96.png"
              alt="YouTube"
              sx={{ width: 57.6, height: 57.6 }}
            />
          </a>
        )}
      </Box>
    </Box>
  );
}
