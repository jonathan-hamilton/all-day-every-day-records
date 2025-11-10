import { SxProps } from '@mui/material/styles';
import { Theme } from '@mui/material';

export const layoutStyles: Record<string, SxProps<Theme>> = {
  root: {
    minHeight: '100vh',
    width: '100%',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'url("/images/background-black-concrete.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  bannerFrame: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'black',
    px: 2,
    py: 1,
  },
  bannerImage: {
    maxWidth: '100%',
    height: 'auto',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  navGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
  },
  navButton: {
    fontWeight: 'bold',
  },
  adminButton: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: '100%',
    px: 0,
    py: 4,
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  footerText: {
    textAlign: 'center',
    py: 2,
  },
  releaseDetailWrapper: (theme: Theme) => ({
    m: 4,
    display: 'flex',
    justifyContent: 'center',
    transform: 'scale(1)',

    [theme.breakpoints.down('sm')]: {
      transform: 'scale(0.9)',
      transformOrigin: 'top center',
    },
  }),
};

