import { Box, Typography, useTheme } from "@mui/material";

export default function Contact() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        marginTop: theme.spacing(8), // space below navbar
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: theme.spacing(4),
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Contact
      </Typography>
      <Typography variant="h6" component="p">
        info@nickelanddimerecords.com
      </Typography>
    </Box>
  );
}
