import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import urlService from '../services/urlService';
import loggingService from '../services/loggingService';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    loggingService.info(`Redirect request received for shortcode: ${shortcode}`);
    const urlData = urlService.getUrlAndLogClick(shortcode);

    if (urlData) {
      if (urlData.isExpired) {
        setError(`This link has expired on ${new Date(urlData.expiresAt).toLocaleString()}.`);
        loggingService.warn('Redirect failed: link expired', { shortcode });
      } else {
        // Perform the redirect
        window.location.href = urlData.originalUrl;
      }
    } else {
      setError('This short link does not exist or is invalid.');
      loggingService.error('Redirect failed: link not found', { shortcode });
    }
  }, [shortcode, navigate]);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Alert severity="error" variant="filled">
          <Typography variant="h5">Redirect Failed</Typography>
          <Typography>{error}</Typography>
        </Alert>
        <Button variant="contained" sx={{mt: 3}} onClick={() => navigate('/')}>Go to Homepage</Button>
      </Box>
    );
  }

  // Display a loading message while the redirect is processed
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Redirecting...
      </Typography>
    </Box>
  );
};

// Added a simple button for navigation back.
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;

export default RedirectHandler;