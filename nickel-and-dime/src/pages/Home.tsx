import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ReleaseTile from "./ReleaseTile";
import { useReleases } from "../context/ReleaseContext";

interface Release {
  id: string;
  cover_image_url: string;
  artist: string;
  title: string;
}

export default function Home() {
  const [featured, setFeatured] = useState<Release | null>(null);
  const [newReleases, setNewReleases] = useState<Release[]>([]);
  const { setReleases } = useReleases();

  useEffect(() => {
    fetch(`https://nickelanddimerecords.com/api/get-homepage-releases.php`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.featured) && data.featured.length > 0) {
          setFeatured(data.featured[0]);
        }
        if (Array.isArray(data.new)) {
          setNewReleases(data.new);
          setReleases([...data.new, data.featured?.[0]].filter(Boolean));
        }
      })
      .catch((err) => console.error("Failed to load releases:", err));
  }, [setReleases]);

  return (
    <Box sx={{ px: "5%", py: 2 }}>
      {/* Flex container to hold Featured + New side by side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "center",
          mt: 4,
        }}
      >
        {/* Featured Release */}
        <Box
          sx={{
            flex: "1 1 33%",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {featured && (
            <ReleaseTile
              id={featured.id}
              size="large"
              imageUrl={featured.cover_image_url}
              artist={featured.artist}
              title={featured.title}
            />
          )}
        </Box>
        {/* New Releases */}
        <Box
          sx={{
            flex: "2 1 66%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gridTemplateRows: { xs: "none", md: "repeat(2, 1fr)" },
            gap: 2,
            width: "100%", // make sure it fills width on mobile
          }}
        >
          {newReleases.map((release) => (
            <ReleaseTile
              key={release.id}
              id={release.id}
              imageUrl={release.cover_image_url}
              artist={release.artist}
              title={release.title}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
