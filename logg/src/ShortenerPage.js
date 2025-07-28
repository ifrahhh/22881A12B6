import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid, Alert, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import urlService from '../services/urlService';
import loggingService from '../services/loggingService';

const URL_INPUT_LIMIT = 5;

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([{ originalUrl: '', customShortcode: '', validity: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index][event.target.name] = event.target.value;
    setInputs(newInputs);
  };

  const addInputRow = () => {
    if (inputs.length < URL_INPUT_LIMIT) {
      setInputs([...inputs, { originalUrl: '', customShortcode: '', validity: '' }]);
    }
  };

  const removeInputRow = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResults([]);
    loggingService.info('Shortening process started.');

    const newResults = [];
    let hasError = false;

    for (const input of inputs) {
      if (!input.originalUrl) continue; // Skip empty rows

      if (!isValidUrl(input.originalUrl)) {
        setError('One or more URLs are invalid. Please check and try again.');
        hasError = true;
        break;
      }
      if (input.validity && !/^\d+$/.test(input.validity)) {
        setError('Validity must be an integer (in minutes).');
        hasError = true;
        break;
      }

      const response = await urlService.createShortUrl(
        input.originalUrl,
        input.customShortcode,
        input.validity ? parseInt(input.validity, 10) : null
      );

      newResults.push({ ...response, originalUrl: input.originalUrl });
      if (!response.success) {
        setError(response.message);
        hasError = true;
        break;
      }
    }
    
    setResults(newResults);
    if (!hasError) {
        setInputs([{ originalUrl: '', customShortcode: '', validity: '' }]); // Reset form on success
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shorten up to 5 URLs
      </Typography>
      <form onSubmit={handleSubmit}>
        {inputs.map((input, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Original Long URL"
                name="originalUrl"
                value={input.originalUrl}
                onChange={(e) => handleInputChange(index, e)}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Custom Shortcode (Optional)"
                name="customShortcode"
                value={input.customShortcode}
                onChange={(e) => handleInputChange(index, e)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={8} sm={2}>
              <TextField
                fullWidth
                label="Validity (mins, Optional)"
                name="validity"
                placeholder="30"
                value={input.validity}
                onChange={(e) => handleInputChange(index, e)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
              {inputs.length > 1 && (
                <IconButton onClick={() => removeInputRow(index)} color="secondary">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 3 }}>
            <Button
                variant="outlined"
                onClick={addInputRow}
                disabled={inputs.length >= URL_INPUT_LIMIT}
                startIcon={<AddCircleOutlineIcon />}
            >
                Add URL
            </Button>
            <Button type="submit" variant="contained" color="primary" size="large">
                Shorten URLs
            </Button>
        </Box>
      </form>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Results</Typography>
            {results.map((result, index) => (
                <Alert 
                    key={index} 
                    severity={result.success ? 'success' : 'error'} 
                    sx={{ mb: 2, '& .MuiAlert-message': { width: '100%' } }}
                >
                    <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <Typography variant="body2" sx={{wordBreak: 'break-all'}}>
                            <strong>Original:</strong> {result.originalUrl}
                        </Typography>
                        {result.success && result.data && (
                            <>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    <strong>Short URL:</strong>{' '}
                                    <a href={`http://localhost:3000/${result.data.shortcode}`} target="_blank" rel="noopener noreferrer">
                                        {`http://localhost:3000/${result.data.shortcode}`}
                                    </a>
                                </Typography>
                                <Typography variant="caption">
                                    Expires on: {new Date(result.data.expiresAt).toLocaleString()}
                                </Typography>
                            </>
                        )}
                        {!result.success && (
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                <strong>Error:</strong> {result.message}
                            </Typography>
                        )}
                    </Box>
                </Alert>
            ))}
        </Box>
      )}
    </Paper>
  );
};

export default ShortenerPage;