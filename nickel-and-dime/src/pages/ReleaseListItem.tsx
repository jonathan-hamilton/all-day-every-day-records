import {
  Button,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Paper,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Release } from "../types/Release";
import { releaseListItemStyles, tagChipStyles } from "../styles/layoutStyles";

interface ReleaseListItemProps {
  release: Release;
  onEdit: (release: Release) => void;
  onDelete: (id: number) => void;
}

export default function ReleaseListItem({
  release,
  onEdit,
  onDelete,
}: ReleaseListItemProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const buttonStyle = isMobile
    ? { minWidth: 0, width: 40, height: 40, padding: 0 }
    : {};

  return (
    <Box sx={releaseListItemStyles.wrapper}>
      <Paper elevation={3} sx={releaseListItemStyles.paper}>
        <ListItem
          disableGutters
          secondaryAction={
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => onEdit(release)}
                size={isMobile ? "small" : "medium"}
                startIcon={isMobile ? <EditOutlinedIcon /> : undefined}
                sx={buttonStyle}
              >
                {!isMobile && "Edit"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(release.id)}
                size={isMobile ? "small" : "medium"}
                startIcon={isMobile ? <DeleteOutlineIcon /> : undefined}
                sx={buttonStyle}
              >
                {!isMobile && "Delete"}
              </Button>
            </Stack>
          }
        >
          <ListItemText
            primary={
              <Box sx={releaseListItemStyles.titleRow}>
                <Typography variant="h6">
                  {release.title} — {release.artist}
                </Typography>
                {release.tag && (
                  <Chip
                    label={release.tag}
                    size="small"
                    sx={{ ml: 1, ...(tagChipStyles[release.tag] || {}) }}
                  />
                )}
              </Box>
            }
          />
        </ListItem>
      </Paper>
    </Box>
  );
}
