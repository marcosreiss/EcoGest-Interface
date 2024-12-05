import 'src/global.css';

// import Fab from '@mui/material/Fab';

import * as useScrollToTop from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

// import { Iconify } from 'src/components/iconify';

import {useAuth} from "./context/AuthContext";
import { PublicRouter, PrivateRouter } from './routes/sections';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop.useScrollToTop();
  const { isAuthenticated } = useAuth();

  return isAuthenticated() ? (
    <ThemeProvider>
      <PrivateRouter />
    </ThemeProvider>
  ) : (
    <ThemeProvider>
      <PublicRouter />
    </ThemeProvider>
  )
}
