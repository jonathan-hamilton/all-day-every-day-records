export const layoutStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  banner: {
    display: 'flex',
    justifyContent: 'center',
    bgcolor: 'black',
  },
  bannerImage: {
      maxWidth: '100%',
      height: 'auto%',
      display: 'block',
      objectFit: 'contain',
      zIndex: 1,
  },
  bannerFrame: {
      position: 'relative',
      display: 'inline-flex',
      backgroundImage: 'url("/images/frames/grunge-frame-5.png")',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      pt: 2,
      pb: 2,
      pl: 4,
      pr: 4,
      m: 4,
      overflow: 'hidden',
      zindex: 2,
  },      
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem'
    },
  },
  navButton: {
    position: 'relative',
    color: 'white',
    fontWeight: 'bold',
    fontSize: {
      xs: '1rem',   // mobile
      sm: '1.2rem', // small tablets
      md: '2.1rem'  // default
    },
    textTransform: 'uppercase',
    height: {
      xs: '48px',
      md: '70px'
    },
    padding: {
      xs: '0 0.5rem',
      md: '0 2rem'
    },
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    '&:hover': {
      backgroundImage: 'url("/images/ui-elements/active-nav-item.png")',
      backgroundSize: '100% auto',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    '&.Mui-selected, &.active': {
      backgroundImage: 'url("/images/ui-elements/active-nav-item.png")',
      backgroundSize: '100% auto',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
  },   
  labelsNavButton: {
    position: 'relative',
    color: 'white',
    fontWeight: 'bold',
    fontSize: {
      xs: '1rem',
      sm: '1.2rem',
      md: '2.1rem',
    },
    padding: {
      xs: '0 0.5rem',
      md: '0 2rem',
    },
    textTransform: 'uppercase',
    '&:hover': {
      backgroundImage: 'url("/images/ui-elements/active-nav-item.png")',
      backgroundSize: '100% auto',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    '&.Mui-selected, &.active': {
      backgroundImage: 'url("/images/ui-elements/active-nav-item.png")',
      backgroundSize: '100% auto',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
  },      
  adminButton: {
    fontSize: '2.1rem',
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  content: {
    flex: 1,
    py: 4
  },
  footerText: {
    fontSize: '2rem',
    color: 'white',
    textAlign: 'center',
    padding: '8px 0'
  },
  menuPaper:{
      backgroundImage: 'url("/images/background-black-concrete.png")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
  }    
};

  export const adminStyles = {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '100%',
    minWidth: '10rem',
  };

  export const adminUploadImageButtonStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "56px",
    width: "66%",
    backgroundColor: "white",
    color: "#1565c0",
    fontWeight: "bold",
    fontSize: "1rem",
    border: "2px solid #1565c0",
    textTransform: "uppercase",
    '&:hover': {
      backgroundColor: "#f0f0f0",
      cursor: "pointer",
    },
  };

  export const releaseListItemStyles = {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      mb: 0, // Remove bottom margin
    },
    paper: {
      width: "100%", // Full width instead of 66%
      p: 2,
      backgroundColor: "white",
    },
    titleRow: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 1,
    },
  };

  export const releaseFormStyles = {
    gridContainer: {
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      gap: 2,
      maxWidth: "1000px",
      margin: "0 auto",
    },
    gridItem: {
      width: "100%",
    },
    gridItemCentered: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    textField: {
      backgroundColor: "white",
    },
  };

  export const tagChipStyles: { [key: string]: unknown } = {
    featured: { backgroundColor: "#2e7d32", color: "white" },
    new: { backgroundColor: "#1976d2", color: "white" },
    removed: { backgroundColor: "#d32f2f", color: "white" },
  };
