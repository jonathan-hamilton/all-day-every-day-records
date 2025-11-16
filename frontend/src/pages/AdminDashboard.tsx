import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Avatar,
  TextField,
  MenuItem,
  Alert,
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
  Divider,

} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {
  Inventory as ReleasesIcon,
  People as UsersIcon,
  VideoLibrary as VideoIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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

const AdminDashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Release management state
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [isCreating, setIsCreating] = useState(true);
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Load releases
  const fetchReleases = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-releases.php?admin=1&_t=${timestamp}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('DEBUG: Releases data received:', data.releases);
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
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReleases();
    }
  }, [isAuthenticated, fetchReleases]);

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

  const handleUploadCoverImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload-cover-image.php`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setFormData(prev => ({ ...prev, cover_image_url: data.url }));
          setSuccess('Cover image uploaded successfully!');
        } else {
          setError(data.error || 'Failed to upload image');
        }
      } catch (err) {
        setError('Network error uploading image');
        console.error('Upload error:', err);
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    // Validate required fields including cover image
    if (!formData.title || !formData.artist) {
      setError('Title and Artist are required');
      return;
    }

    if (!formData.cover_image_url) {
      setError('Cover image is required. Please upload an image first.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        id: editingRelease?.id
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upsert-release.php`, {
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
        
        // Optimistic update: immediately update the local state
        if (editingRelease?.id) {
          setReleases(prev => prev.map(release => 
            release.id === editingRelease.id 
              ? { 
                  ...release, 
                  ...submitData,
                  // Ensure the id is preserved
                  id: editingRelease.id
                }
              : release
          ));
        }
        
        handleCancelEdit();
        
        // Fetch fresh data in the background without showing loading state
        // The optimistic update already shows the changes immediately
        setTimeout(() => {
          fetchReleases();
        }, 100); // Small delay to ensure smooth UI transition
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

  const otherDashboardCards = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: <UsersIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      action: 'Manage',
      path: '/admin/users'
    },
    {
      title: 'Home Page Videos',
      description: 'Manage YouTube videos displayed on the homepage',
      icon: <VideoIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      action: 'Manage',
      path: '/admin/videos'
    }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mr: 2,
                width: 60,
                height: 60
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Admin Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Welcome back, {user?.username || 'Administrator'}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>

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

      {/* Release Management Section */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
          <ReleasesIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" fontWeight="medium">
            Manage Releases
          </Typography>
        </Box>
        
        {/* Release Form - Always Visible */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {isCreating ? 'Create New Release' : editingRelease ? `Edit: ${editingRelease?.title}` : 'Create New Release'}
          </Typography>
              
              <Stack spacing={3} sx={{ mt: 2 }}>
                {/* Title, Artist, and Format Row - 3 fields */}
                <Stack direction={{ xs: 'column', sm: 'column', md: 'row' }} spacing={2}>
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

                  <TextField
                    fullWidth
                    label="Format"
                    value={formData.format || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                    placeholder="e.g. Single, EP, Album, Mixtape"
                  />
                </Stack>

                {/* Release Date and Tag Row */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <DatePicker
                    label="Release Date"
                    value={formData.release_date ? dayjs(formData.release_date) : null}
                    onChange={(date: Dayjs | null) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        release_date: date ? date.format('YYYY-MM-DD') : '' 
                      }));
                    }}
                    minDate={dayjs('1980-01-01')}
                    maxDate={dayjs('2040-12-31')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined'
                      }
                    }}
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

                {/* Hidden Cover Image URL field - populated by upload */}
                <input
                  type="hidden"
                  value={formData.cover_image_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                />

                {/* Upload Cover Image Button - Primary way to set cover image */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Cover Image *
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      variant={formData.cover_image_url ? "outlined" : "contained"}
                      startIcon={<UploadIcon />}
                      onClick={handleUploadCoverImage}
                      color={formData.cover_image_url ? "success" : "primary"}
                    >
                      {formData.cover_image_url ? "Change Cover Image" : "Upload Cover Image"}
                    </Button>
                    {formData.cover_image_url && (
                      <Typography variant="body2" color="success.main">
                        ✓ Image uploaded successfully
                      </Typography>
                    )}
                  </Stack>
                </Box>

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
                
                {/* First row of streaming links */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
                </Stack>
                
                {/* Second row of streaming links */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
                  disabled={saving || !formData.title || !formData.artist || !formData.cover_image_url}
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

          {/* Releases List Header and Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              All Releases
            </Typography>
            <Box>
              {editingRelease ? (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleCreateNew}
                  size="large"
                  sx={{ mr: 1 }}
                >
                  Create New
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateNew}
                  size="large"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create New Release'}
                </Button>
              )}
            </Box>
          </Box>

          {/* Releases Table */}
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
                    releases.map((release) => {
                      console.log(`DEBUG: Release ${release.title} has tag:`, release.tag);
                      return (
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
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

      {/* Other Dashboard Cards */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
          Other Administration Tools
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3}>
          {otherDashboardCards.map((card, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  {card.icon}
                  <Typography variant="h6" component="h3" sx={{ ml: 2, fontWeight: 'medium' }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => navigate(card.path)}
                  fullWidth
                >
                  {card.action}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Footer Note */}
      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          All Day Every Day Records - Admin Panel v1.0
        </Typography>
      </Box>
    </Container>
    </LocalizationProvider>
  );
};

export default AdminDashboard;