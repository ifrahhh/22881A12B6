// FILE: src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './HomePage';
import StatsPage from './StatsPage';
import RedirectPage from './RedirectPage';
import Header from './Header';

// A simple theme for the application
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
      <CssBaseline />
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
            {/* This route must be last to act as a catch-all for shortcodes */}
            <Route path="/:shortCode" element={<RedirectPage />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;