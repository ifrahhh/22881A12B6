import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Collapse, IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import urlService from '../services/urlService';

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);
  const isExpired = new Date(row.expiresAt) < new Date();
  const shortUrl = `http://localhost:3000/${row.shortcode}`;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: isExpired ? '#ffebee' : 'inherit' }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
            {isExpired && <Typography variant="caption" color="error" sx={{ml: 1}}>(Expired)</Typography>}
        </TableCell>
        <TableCell sx={{ wordBreak: 'break-all' }}>{row.originalUrl}</TableCell>
        <TableCell align="center">{row.clicks.length}</TableCell>
        <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(row.expiresAt).toLocaleString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Click History
              </Typography>
              {row.clicks.length > 0 ? (
                <Table size="small" aria-label="click history">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source (Referrer)</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.clicks.map((click, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                        <TableCell sx={{wordBreak: 'break-all'}}>{click.source}</TableCell>
                        <TableCell>{click.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" sx={{my: 2}}>No clicks recorded yet.</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const StatisticsPage = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    setUrls(urlService.getAllUrls());
  }, []);

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Statistics
      </Typography>
      {urls.length === 0 ? (
        <Typography>No shortened URLs found. Create one on the 'Shorten' page!</Typography>
      ) : (
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell align="center">Clicks</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default StatisticsPage;