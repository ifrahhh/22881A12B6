import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Container, Tabs, Tab, Box } from '@mui/material';
import ShortenerPage from './pages/ShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectHandler from './pages/RedirectHandler';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout />
      </Router>
    </ThemeProvider>
  );
}

function MainLayout() {
  const location = useLocation();
  const path = location.pathname;

  // Don't show header/nav on redirect routes
  const isRedirectRoute = path !== '/' && path !== '/stats';

  return (
    <>
      {!isRedirectRoute && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              React URL Shortener
            </Typography>
            <Tabs
              value={path}
              textColor="inherit"
              indicatorColor="secondary"
            >
              <Tab label="Shorten" value="/" to="/" component={RouterLink} />
              <Tab label="Statistics" value="/stats" to="/stats" component={RouterLink} />
            </Tabs>
          </Toolbar>
        </AppBar>
      )}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;