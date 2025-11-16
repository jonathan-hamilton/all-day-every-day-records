import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Stack,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Release {
  id?: number;
  title: string;
  artist: string;
  format: string;
  release_date: string;
  description: string;
  cover_image_url: string;
  spotify_url: string;
  apple_music_url: string;
  amazon_music_url: string;
  youtube_url: string;
  tag: 'None' | 'Featured' | 'New' | 'Removed';
  created_at?: string;
  updated_at?: string;
}

const AdminReleases: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Release>>({
    title: '',
    artist: '',
    format: '',
    release_date: '',
    description: '',
    cover_image_url: '',
    spotify_url: '',
    apple_music_url: '',
    amazon_music_url: '',
    youtube_url: '',
    tag: 'None'
  });

  // Load releases
  const fetchReleases = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get-releases.php?admin=1`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setReleases(data.releases || []);
      } else {
        setError(data.error || 'Failed to fetch releases');
      }
    } catch (err) {
      setError('Network error fetching releases');
      console.error('Fetch releases error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReleases();
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingRelease(null);
    setFormData({
      title: '',
      artist: '',
      format: '',
      release_date: '',
      description: '',
      cover_image_url: '',
      spotify_url: '',
      apple_music_url: '',
      amazon_music_url: '',
      youtube_url: '',
      tag: 'None'
    });
    clearMessages();
  };

  const handleEditRelease = (release: Release) => {
    setIsCreating(false);
    setEditingRelease(release);
    setFormData({ ...release });
    clearMessages();
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingRelease(null);
    setFormData({
      title: '',
      artist: '',
      format: '',
      release_date: '',
      description: '',
      cover_image_url: '',
      spotify_url: '',
      apple_music_url: '',
      amazon_music_url: '',
      youtube_url: '',
      tag: 'None'
    });
    clearMessages();
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.artist) {
      setError('Title and Artist are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        id: editingRelease?.id,
        // Convert simplified form data to API format
        artists: formData.title ? [{ name: 'Various Artists', role: 'artist' }] : [],
        streaming_links: []
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/upsert-release.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(isCreating ? 'Release created successfully!' : 'Release updated successfully!');
        handleCancelEdit();
        fetchReleases();
      } else {
        setError(data.error || 'Failed to save release');
      }
    } catch (err) {
      setError('Network error saving release');
      console.error('Save release error:', err);
    } finally {
      setSaving(false);
    }
  };

  const getTagColor = (tag: string): 'default' | 'success' | 'info' | 'error' => {
    switch (tag) {
      case 'Featured': return 'success';
      case 'New': return 'info';
      case 'Removed': return 'error';
      default: return 'default';
    }
  };

  const isFormMode = isCreating || editingRelease !== null;

  if (!isAuthenticated) {
    return (
      <Container>
        <Alert severity="error">You must be logged in to access this page.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/admin')} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            All Day Every Day Records - Release Management
          </Typography>
        </Box>
        
        {!isFormMode && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            size="large"
          >
            Create New Release
          </Button>
        )}
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>
          {success}
        </Alert>
      )}

      {/* Form Mode */}
      {isFormMode && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {isCreating ? 'Create New Release' : `Edit: ${editingRelease?.title}`}
          </Typography>
          
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Title and Artist Row */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Title *"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
              
              <TextField
                fullWidth
                label="Artist *"
                value={formData.artist || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
              />
            </Stack>

            {/* Format and Release Date Row */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Format"
                value={formData.format || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                placeholder="e.g. Single, EP, Album, Mixtape"
              />

              <TextField
                fullWidth
                label="Release Date"
                type="date"
                value={formData.release_date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                select
                label="Tag"
                value={formData.tag || 'None'}
                onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value as Release['tag'] }))}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Featured">Featured</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Removed">Removed</MenuItem>
              </TextField>
            </Stack>

            {/* Cover Image URL and Upload Button */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="end">
              <TextField
                fullWidth
                label="Cover Image URL"
                value={formData.cover_image_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
              />
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => {/* TODO: Implement file upload */}}
                sx={{ minWidth: 'fit-content', whiteSpace: 'nowrap' }}
              >
                Upload Cover Image
              </Button>
            </Stack>

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />

            {/* Streaming URLs */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Streaming Links
            </Typography>
            
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Spotify URL"
                value={formData.spotify_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, spotify_url: e.target.value }))}
                placeholder="https://open.spotify.com/..."
              />
              
              <TextField
                fullWidth
                label="Apple Music URL"
                value={formData.apple_music_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, apple_music_url: e.target.value }))}
                placeholder="https://music.apple.com/..."
              />
              
              <TextField
                fullWidth
                label="Amazon Music URL"
                value={formData.amazon_music_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, amazon_music_url: e.target.value }))}
                placeholder="https://music.amazon.com/..."
              />
              
              <TextField
                fullWidth
                label="YouTube URL"
                value={formData.youtube_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                placeholder="https://www.youtube.com/..."
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Form Actions */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Saving...' : (isCreating ? 'Create Release' : 'Update Release')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Releases List */}
      {!isFormMode && (
        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cover</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Artist</TableCell>
                  <TableCell>Format</TableCell>
                  <TableCell>Release Date</TableCell>
                  <TableCell>Tag</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : releases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">
                        No releases found. Create your first release to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  releases.map((release) => (
                    <TableRow key={release.id} hover sx={{ cursor: 'pointer' }}>
                      <TableCell onClick={() => handleEditRelease(release)} sx={{ width: 80 }}>
                        <Box
                          component="img"
                          src={release.cover_image_url}
                          alt={`${release.title} cover`}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: 'grey.100'
                          }}
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.style.backgroundColor = '#f5f5f5';
                            target.parentElement!.style.display = 'flex';
                            target.parentElement!.style.alignItems = 'center';
                            target.parentElement!.style.justifyContent = 'center';
                            target.parentElement!.innerHTML = '🎵';
                          }}
                        />
                      </TableCell>
                      <TableCell onClick={() => handleEditRelease(release)}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {release.title}
                        </Typography>
                      </TableCell>
                      <TableCell onClick={() => handleEditRelease(release)}>
                        {release.artist || 'Unknown Artist'}
                      </TableCell>
                      <TableCell onClick={() => handleEditRelease(release)}>
                        {release.format || 'Not specified'}
                      </TableCell>
                      <TableCell onClick={() => handleEditRelease(release)}>
                        {release.release_date ? new Date(release.release_date).toLocaleDateString() : 'TBD'}
                      </TableCell>
                      <TableCell onClick={() => handleEditRelease(release)}>
                        <Chip
                          label={release.tag}
                          color={getTagColor(release.tag)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleEditRelease(release)}
                          size="small"
                          title="Edit Release"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default AdminReleases;