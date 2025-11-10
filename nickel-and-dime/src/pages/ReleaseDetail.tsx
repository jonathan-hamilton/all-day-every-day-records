import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import StreamingIconRow from "../components/StreamingIconRow";
import { layoutStyles } from "../layouts/MainLayout.styles";

export default function ReleaseDetail() {
  const { id } = useParams<{ id: string }>();
  const [fetchedRelease, setFetchedRelease] = useState<any>(null);

  // Always use fresh API data instead of cached context data
  const release = fetchedRelease;

  useEffect(() => {
    if (id) {
      fetch(
        `https://nickelanddimerecords.com/api/get-releases-by-id.php?id=${id}`
      )
        .then((res) => res.json())
        .then((data) => {
          setFetchedRelease(data.release);
        })
        .catch((err) => console.error("Failed to fetch release:", err));
    }
  }, [id]);

  if (!release) {
    return <Typography>Release not found.</Typography>;
  }

  const randomFrameNumber = Math.floor(Math.random() * 6) + 1;
  const frameUrl = `/images/frames/grunge-frame-${randomFrameNumber}.png`;
  const imageUrl = release.cover_image_url?.startsWith("http")
    ? release.cover_image_url
    : `https://nickelanddimerecords.com${release.cover_image_url}`;

  const formatReleaseDate = (dateStr: string) => {
    // Since the API now returns just the year, return it as-is
    if (!dateStr || dateStr === "0000-00-00" || dateStr === "0000") return "";
    return dateStr;
  };

  return (
    <Box sx={{ ...layoutStyles.releaseDetailWrapper, px: "5%", py: 2, display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "center",
          maxWidth: "1200px", // Add max width to prevent stretching on very wide screens
          width: "100%",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "75%", md: 432 }, // 75% of original 576
            aspectRatio: "1 / 1",
            backgroundImage: `url(${frameUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: 3.24, // 75% of original 4.32
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={`${release.title} Cover`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            {release.artist}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {release.title}
          </Typography>
          {release.description && (
            <Typography variant="body1" gutterBottom>
              {release.description}
            </Typography>
          )}
          {release.release_date && release.release_date !== "0000-00-00" && (
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Released: {formatReleaseDate(release.release_date)}
            </Typography>
          )}
          {release.format && (
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Format: {release.format}
            </Typography>
          )}
          {(release.spotify_url ||
            release.apple_music_url ||
            release.amazon_music_url ||
            release.youtube_url) && (
            <StreamingIconRow
              links={{
                spotify: release.spotify_url,
                apple: release.apple_music_url,
                amazon: release.amazon_music_url,
                youtube: release.youtube_url,
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
