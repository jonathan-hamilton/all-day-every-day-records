import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { layoutStyles } from "../layouts/MainLayout.styles.ts";

interface ReleaseTileProps {
  id: string;
  imageUrl: string;
  artist: string;
  title: string;
  size?: "large" | "small";
}

export default function ReleaseTile({
  id,
  imageUrl,
  artist,
  title,
  size = "small",
}: ReleaseTileProps) {
  const isLarge = size === "large";

  // Random frame 1-6
  const randomFrameNumber = Math.floor(Math.random() * 6) + 1;
  const frameUrl = `/images/frames/grunge-frame-${randomFrameNumber}.png`;

  const frameSize = isLarge ? 360 : 216; // 20% increase from 300 and 180

  const resolvedImageUrl = imageUrl.startsWith("/")
    ? `https://nickelanddimerecords.com${imageUrl}`
    : imageUrl;

  return (
    <Link
      to={`/releases/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Box sx={{ textAlign: "center", ...layoutStyles.releaseTile }}>
        {/* Frame around only the image */}
        <Box
          sx={{
            position: "relative",
            width: frameSize,
            height: frameSize,
            backgroundImage: `url(${frameUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: isLarge ? 3 : 2,
            mb: 1, // margin bottom to separate from text
            mx: "auto",
          }}
        >
          <Box
            component="img"
            src={resolvedImageUrl}
            alt={`${artist} - ${title}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        </Box>
        <Typography 
          variant={isLarge ? "h5" : "h6"} 
          sx={{ 
            fontWeight: "bold",
            fontSize: "1.5rem"
          }}
        >
          {artist}
        </Typography>
        <Typography 
          variant="body2"
          sx={{
            fontSize: "1.5rem",
            color: "#7a0c0a"
          }}
        >
          {title}
        </Typography>
      </Box>
    </Link>
  );
}
