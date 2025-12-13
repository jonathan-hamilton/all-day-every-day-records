/**
 * API Test Page
 * 
 * Development page for testing and validating API integration.
 * Provides interactive interface to test all endpoints and view results.
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';

import { ConnectivityStatus } from '../components/ConnectivityStatus';
import { createServices } from '../services';
import type { ReleaseOverview, ReleaseWithDetails, ApiErrorType } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ApiTest: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Release data states
  const [releases, setReleases] = useState<ReleaseOverview[]>([]);
  const [featuredReleases, setFeaturedReleases] = useState<ReleaseOverview[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<ReleaseWithDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReleaseOverview[]>([]);
  
  const services = createServices();

  const handleError = (err: unknown) => {
    const apiError = err as ApiErrorType;
    setError(apiError.message || 'An unknown error occurred');
    console.error('API Test Error:', err);
  };

  const testGetAllReleases = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await services.releases.getReleases({ limit: 10 });
      setReleases(results);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const testGetFeaturedReleases = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await services.releases.getFeaturedReleases(6);
      setFeaturedReleases(results);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const testGetReleaseById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await services.releases.getReleaseById(id);
      setSelectedRelease(result);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const testSearchReleases = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const results = await services.releases.searchReleases(searchQuery, 10);
      setSearchResults(results);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    testGetAllReleases();
    testGetFeaturedReleases();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        API Integration Test
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        This page validates the frontend-backend API integration for All Day Every Day Records.
        Test each endpoint to ensure proper connectivity and data flow.
      </Typography>

      {/* Connectivity Status */}
      <Box mb={4}>
        <ConnectivityStatus />
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>API Test Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* API Test Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="API test tabs">
            <Tab label="All Releases" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Featured Releases" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Release Details" id="tab-2" aria-controls="tabpanel-2" />
            <Tab label="Search" id="tab-3" aria-controls="tabpanel-3" />
          </Tabs>
        </Box>

        {/* All Releases Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">All Releases Endpoint Test</Typography>
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
              onClick={testGetAllReleases}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            Tests: GET /get-releases.php
          </Typography>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Results ({releases.length} releases)
              </Typography>
              
              {releases.length === 0 && !loading && (
                <Alert severity="info">No releases found or endpoint not responding.</Alert>
              )}
              
              <List dense>
                {releases.map((release) => (
                  <ListItem key={release.id} disablePadding>
                    <ListItemButton onClick={() => testGetReleaseById(release.id)}>
                      <ListItemText
                        primary={release.title}
                        secondary={
                          <Box component="span">
                            <Chip label={release.release_type} size="small" sx={{ mr: 1 }} />
                            {release.release_date && `Released: ${release.release_date}`}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Featured Releases Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Featured Releases Endpoint Test</Typography>
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
              onClick={testGetFeaturedReleases}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            Tests: GET /get-releases.php?featured=true
          </Typography>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Results ({featuredReleases.length} featured releases)
              </Typography>
              
              {featuredReleases.length === 0 && !loading && (
                <Alert severity="warning">No featured releases found.</Alert>
              )}
              
              <List dense>
                {featuredReleases.map((release) => (
                  <ListItem key={release.id} disablePadding>
                    <ListItemButton onClick={() => testGetReleaseById(release.id)}>
                      <ListItemText
                        primary={release.title}
                        secondary={
                          <Box component="span">
                            <Chip label="Featured" color="primary" size="small" sx={{ mr: 1 }} />
                            <Chip label={release.release_type} size="small" sx={{ mr: 1 }} />
                            Order: {release.display_order}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Release Details Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Release Details Endpoint Test
          </Typography>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            Tests: GET /get-releases-by-id.php?id={'{id}'}
          </Typography>
          
          <Typography variant="body2" mb={2}>
            Click on any release from the previous tabs to test the details endpoint.
          </Typography>
          
          {selectedRelease && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedRelease.title}
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    ID: {selectedRelease.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {selectedRelease.release_type} | Status: {selectedRelease.status}
                  </Typography>
                </Box>
                
                {selectedRelease.description && (
                  <Typography variant="body1" paragraph>
                    {selectedRelease.description}
                  </Typography>
                )}
                
                <Typography variant="subtitle2" gutterBottom>
                  Artists ({selectedRelease.artists.length})
                </Typography>
                <List dense>
                  {selectedRelease.artists.map((artist, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={artist.name}
                        secondary={`Role: ${artist.role}`}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Typography variant="subtitle2" gutterBottom>
                  Streaming Links ({selectedRelease.streaming_links.length})
                </Typography>
                <List dense>
                  {selectedRelease.streaming_links.map((link, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={link.platform}
                        secondary={link.url}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
          
          {!selectedRelease && (
            <Alert severity="info">
              No release selected. Click on a release from the "All Releases" or "Featured Releases" tabs.
            </Alert>
          )}
        </TabPanel>

        {/* Search Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Search Endpoint Test
          </Typography>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            Tests: GET /get-releases.php?search={'{query}'}
          </Typography>
          
          <Box display="flex" gap={2} mb={3}>
            <TextField
              fullWidth
              label="Search Query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter release title or artist name..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  testSearchReleases();
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : <SearchIcon />}
              onClick={testSearchReleases}
              disabled={loading || !searchQuery.trim()}
            >
              Search
            </Button>
          </Box>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Search Results ({searchResults.length} releases)
              </Typography>
              
              {searchResults.length === 0 && searchQuery && !loading && (
                <Alert severity="info">No releases found for "{searchQuery}".</Alert>
              )}
              
              <List dense>
                {searchResults.map((release) => (
                  <ListItem key={release.id} disablePadding>
                    <ListItemButton onClick={() => testGetReleaseById(release.id)}>
                      <ListItemText
                        primary={release.title}
                        secondary={
                          <Box component="span">
                            <Chip label={release.release_type} size="small" sx={{ mr: 1 }} />
                            {release.release_date && `Released: ${release.release_date}`}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Development Info */}
      <Box mt={4}>
        <Alert severity="info">
          <AlertTitle>Development Information</AlertTitle>
          <Typography variant="body2">
            Backend URL: {services.api.getClient().defaults.baseURL}
          </Typography>
          <Typography variant="body2">
            Environment: {import.meta.env.MODE}
          </Typography>
          <Typography variant="body2">
            This page is only available in development mode for API testing and validation.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};