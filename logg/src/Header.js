import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>URL Shortener</Link>
        </Typography>
        <Link to="/stats" style={{ color: '#fff', textDecoration: 'none', marginLeft: '20px' }}>
          Stats
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
