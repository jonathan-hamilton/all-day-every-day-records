import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import styles from "../styles/components/MainLayout.module.css";
import { layoutStyles } from "../styles/layoutStyles";

export default function MainLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const isLabelsActive =
    location.pathname.startsWith("/triple-x") ||
    location.pathname.startsWith("/ransom-note");
  const [isAdmin, setIsAdmin] = useState(false);

  // Determine banner image based on current route
  const getBannerImage = () => {
    if (location.pathname.startsWith("/triple-x")) {
      return "/images/triple-x-banner-1800x356.png";
    } else if (location.pathname.startsWith("/ransom-note")) {
      return "/images/ransom-note-banner-1800x500.png";
    }
    return "/images/nickel-and-dime-billboard-1800x381.jpg";
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setIsAdmin(user?.is_admin === 1);
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Box sx={layoutStyles.root}>
      <CssBaseline />
      <AppBar position="static" className={styles.header}>
        <Box sx={layoutStyles.bannerFrame}>
          <Box
            component="img"
            src={getBannerImage()}
            alt="Banner"
            sx={layoutStyles.bannerImage}
          />
        </Box>
        <Toolbar sx={layoutStyles.toolbar}>
          <Box sx={layoutStyles.navGroup}>
            <Button
              color="inherit"
              component={NavLink}
              to="/"
              sx={layoutStyles.navButton}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/releases"
              sx={layoutStyles.navButton}
            >
              Releases
            </Button>
            <Button
              color="inherit"
              onClick={handleMenuClick}
              sx={layoutStyles.labelsNavButton}
              className={isLabelsActive ? "Mui-selected" : undefined}
            >
              Labels
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: layoutStyles.menuPaper,
              }}
            >
              <MenuItem
                component={NavLink}
                to="/triple-x"
                sx={layoutStyles.navButton}
                onClick={handleMenuClose}
              >
                Triple X
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/ransom-note"
                sx={layoutStyles.navButton}
                onClick={handleMenuClose}
              >
                Ransom Note
              </MenuItem>
            </Menu>
            <Button
              color="inherit"
              component={NavLink}
              to="/contact"
              sx={layoutStyles.navButton}
            >
              Contact
            </Button>
          </Box>
          {isAdmin && (
            <Stack direction="row" spacing={1}>
              <Button
                color="inherit"
                component={NavLink}
                to="/admin"
                sx={layoutStyles.navButton}
              >
                Admin
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/change-password"
                sx={layoutStyles.navButton}
              >
                Settings
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={layoutStyles.navButton}
              >
                Logout
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} disableGutters sx={layoutStyles.content}>
        <Outlet />
      </Container>
      <Box component="footer" className={styles.footer}>
        <Typography sx={layoutStyles.footerText}>
          © {new Date().getFullYear()} Nickel & Dime Records
        </Typography>
      </Box>
    </Box>
  );
}
