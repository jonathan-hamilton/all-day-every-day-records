import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
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
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Inventory as ReleasesIcon,
  People as UsersIcon,
  VideoLibrary as VideoIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getCurrentApiConfig } from '../config/api';
import type { Video } from '../types';

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
  youtube_music_url: string;
  youtube_url: string;
  youtube2_url: string;
  tag: 'None' | 'Featured' | 'New' | 'Recent' | 'Removed';
  show_in_releases: boolean;
  show_in_discography: boolean;
  created_at?: string;
  updated_at?: string;
}

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Get API configuration
  const apiConfig = getCurrentApiConfig();

  // Tab state (0 = Releases, 1 = Videos)
  const [activeTab, setActiveTab] = useState(0);

  // Release management state
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [videoSearchTerm, setVideoSearchTerm] = useState<string>('');
  
  // YouTube URL validation helper
  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return true; // Empty URLs are valid (optional field)
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url.trim());
  };
  
  // Auto-clear success messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Filter releases based on search term
  const filteredReleases = releases.filter(release => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      release.title.toLowerCase().includes(searchLower) ||
      release.artist.toLowerCase().includes(searchLower) ||
      release.format.toLowerCase().includes(searchLower) ||
      release.tag.toLowerCase().includes(searchLower)
    );
  });

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
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
    youtube_music_url: '',
    youtube_url: '',
    youtube2_url: '',
    tag: 'None',
    show_in_releases: true,
    show_in_discography: false
  });

  // Homepage videos state
  const [homepageVideos, setHomepageVideos] = useState<string[]>(['', '', '', '']);
  const [videosSaving, setVideosSaving] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoSuccess, setVideoSuccess] = useState<string | null>(null);
  
  // Video management state (for Manage Videos tab)
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isCreatingVideo, setIsCreatingVideo] = useState(true);
  const [videoFormData, setVideoFormData] = useState<Partial<Video>>({
    title: '',
    artist: '',
    youtube_url: '',
    description: ''
  });

  // Filter videos based on search term
  const filteredVideos = videos.filter(video => {
    if (!videoSearchTerm) return true;
    const searchLower = videoSearchTerm.toLowerCase();
    return (
      video.title.toLowerCase().includes(searchLower) ||
      video.artist.toLowerCase().includes(searchLower) ||
      video.youtube_url.toLowerCase().includes(searchLower)
    );
  });

  // Clear video search
  const handleClearVideoSearch = () => {
    setVideoSearchTerm('');
  };
  
  // Auto-clear video success messages after 3 seconds
  useEffect(() => {
    if (videoSuccess) {
      const timer = setTimeout(() => {
        setVideoSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [videoSuccess]);

  // Load releases
  const fetchReleases = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`${apiConfig.baseURL}/get-releases.php?admin=1&_t=${timestamp}`, {
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
  }, [isAuthenticated, apiConfig.baseURL]);

  // Load homepage videos
  const fetchHomepageVideos = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch(`${apiConfig.baseURL}/get-homepage-videos.php`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success && Array.isArray(data.videos)) {
        // Ensure we always have exactly 4 URLs
        const videos = [...data.videos];
        while (videos.length < 4) {
          videos.push('');
        }
        setHomepageVideos(videos.slice(0, 4));
      }
    } catch (err) {
      console.error('Fetch homepage videos error:', err);
    }
  }, [isAuthenticated, apiConfig.baseURL]);

  // Load videos for management
  const fetchVideos = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`${apiConfig.baseURL}/get-videos.php?_t=${timestamp}`, {
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
        setVideos(data.videos || []);
      } else {
        setError(data.error || 'Failed to fetch videos');
      }
    } catch (err) {
      setError('Network error fetching videos');
      console.error('Fetch videos error:', err);
    }
  }, [isAuthenticated, apiConfig.baseURL]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReleases();
      fetchHomepageVideos();
      fetchVideos();
    }
  }, [isAuthenticated, fetchReleases, fetchHomepageVideos, fetchVideos]);

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
      youtube_music_url: '',
      youtube_url: '',
      youtube2_url: '',
      tag: 'None',
      show_in_releases: true,
      show_in_discography: false
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
      youtube_music_url: '',
      youtube_url: '',
      youtube2_url: '',
      tag: 'None',
      show_in_releases: true,
      show_in_discography: false
    });
    clearMessages();
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const clearVideoMessages = () => {
    setVideoError(null);
    setVideoSuccess(null);
  };

  // Handle homepage video updates
  const handleUpdateVideos = async () => {
    setVideosSaving(true);
    setVideoError(null);
    setVideoSuccess(null);
    
    try {
      const response = await fetch(`${apiConfig.baseURL}/update-homepage-videos.php?admin=true`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videos: homepageVideos })
      });

      const data = await response.json();
      
      if (data.success) {
        setVideoSuccess('Homepage videos updated successfully!');
        // Update local state with response data
        if (Array.isArray(data.videos)) {
          const videos = [...data.videos];
          while (videos.length < 4) {
            videos.push('');
          }
          setHomepageVideos(videos.slice(0, 4));
        }
      } else {
        setVideoError(data.error || 'Failed to update homepage videos');
      }
    } catch (err) {
      setVideoError('Network error updating videos');
      console.error('Update videos error:', err);
    } finally {
      setVideosSaving(false);
    }
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
        const response = await fetch(`${apiConfig.baseURL}/upload-cover-image.php`, {
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

    // Validate YouTube URLs
    if (!isValidYouTubeUrl(formData.youtube_url)) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=...)');
      return;
    }

    if (!isValidYouTubeUrl(formData.youtube2_url)) {
      setError('Invalid YouTube URL 2. Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=...)');
      return;
    }

    if (!isValidYouTubeUrl(formData.youtube_music_url)) {
      setError('Invalid YouTube Music URL. Please enter a valid YouTube Music URL.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        id: editingRelease?.id,
        show_in_releases: formData.show_in_releases ?? true,
        show_in_discography: formData.show_in_discography ?? false
      };

      const response = await fetch(`${apiConfig.baseURL}/upsert-release.php`, {
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
      case 'Recent': return 'info';
      case 'Removed': return 'error';
      default: return 'default';
    }
  };

  // Video form handlers
  const handleVideoInputChange = (field: keyof Video, value: string) => {
    setVideoFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetVideoForm = () => {
    setVideoFormData({
      title: '',
      artist: '',
      youtube_url: '',
      description: ''
    });
    setEditingVideo(null);
    setIsCreatingVideo(true);
  };

  const handleCreateNewVideo = () => {
    resetVideoForm();
    setIsCreatingVideo(true);
  };

  const handleCancelVideoEdit = () => {
    resetVideoForm();
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setIsCreatingVideo(false);
    setVideoFormData({
      title: video.title,
      artist: video.artist,
      youtube_url: video.youtube_url,
      description: video.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVideoSubmit = async () => {
    if (!videoFormData.title || !videoFormData.artist || !videoFormData.youtube_url) {
      setError('Please fill in all required fields (Title, Artist, YouTube URL)');
      return;
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(videoFormData.youtube_url)) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=...)');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData: Partial<Video> = {
        title: videoFormData.title,
        artist: videoFormData.artist,
        youtube_url: videoFormData.youtube_url,
        description: videoFormData.description || ''
      };

      if (editingVideo?.id) {
        submitData.id = editingVideo.id;
      }

      const response = await fetch(`${apiConfig.baseURL}/upsert-video.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingVideo ? `Video "${data.video.title}" updated successfully` : `Video "${data.video.title}" created successfully`);
        resetVideoForm();
        fetchVideos();
      } else {
        setError(data.error || 'Failed to save video');
      }
    } catch (err) {
      setError('Network error saving video');
      console.error('Save video error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (video: Video) => {
    if (!window.confirm(`Are you sure you want to delete "${video.title}" by ${video.artist}?`)) {
      return;
    }

    try {
      const response = await fetch(`${apiConfig.baseURL}/delete-video.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: video.id })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Video "${video.title}" deleted successfully`);
        
        // If we were editing this video, reset the form
        if (editingVideo?.id === video.id) {
          resetVideoForm();
        }
        
        fetchVideos();
      } else {
        setError(data.error || 'Failed to delete video');
      }
    } catch (err) {
      setError('Network error deleting video');
      console.error('Delete video error:', err);
    }
  };

  const otherDashboardCards = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: <UsersIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      action: 'Manage',
      path: '/admin/users'
    }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 4, mb: 4, width: '100%', overflow: 'hidden' }}>
        {/* Page Title */}
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 4, color: 'white' }}>
          Admin Dashboard
        </Typography>

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

      {/* Tabs for Release vs Video Management */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1rem',
              fontWeight: 'medium',
              '&.Mui-selected': {
                color: 'white'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main'
            }
          }}
        >
          <Tab label="Manage Releases" />
          <Tab label="Manage Videos" />
        </Tabs>
      </Box>

      {/* Release Management Section */}
      <Box sx={{ mb: 4, display: activeTab === 0 ? 'block' : 'none' }}>
        <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
          <ReleasesIcon sx={{ mr: 2, color: 'white', fontSize: '2rem' }} />
          <Typography variant="h5" component="h2" fontWeight="medium" sx={{ color: 'white' }}>
            Manage Releases
          </Typography>
        </Box>
        
        {/* Release Form - Always Visible */}
        <Paper elevation={3} sx={{ 
          p: 4, 
          mb: 4,
          backgroundImage: 'url(/images/abstract-black-grunge-texture-scaled-900x120.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1
          },
          '& > *': {
            position: 'relative',
            zIndex: 2
          }
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            {isCreating ? 'Create New Release' : editingRelease ? `Edit: ${editingRelease?.title}` : 'Create New Release'}
          </Typography>
              
              <Stack spacing={3} sx={{ 
                mt: 2,
                '& .MuiTextField-root, & .MuiFormControl-root': {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(200, 200, 200, 0.8)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(200, 200, 200, 1)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: 'primary.main'
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: 'white'
                  },
                  '& .MuiSelect-icon, & .MuiIconButton-root': {
                    color: 'white'
                  }
                }
              }}>
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

                {/* Release Year and Tag Row */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Release Year"
                    value={formData.release_date ? formData.release_date.split('-')[0] : ''}
                    onChange={(e) => {
                      const year = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setFormData(prev => ({ 
                        ...prev, 
                        release_date: year && year.length === 4 ? `${year}-01-01` : (year || '') 
                      }));
                    }}
                    onBlur={(e) => {
                      const year = e.target.value.replace(/\D/g, '');
                      if (year && year.length < 4) {
                        // Clear incomplete year on blur
                        setFormData(prev => ({ ...prev, release_date: '' }));
                      }
                    }}
                    placeholder="YYYY"
                    inputProps={{
                      maxLength: 4,
                      pattern: '[0-9]{4}'
                    }}
                    helperText="Enter 4-digit year (e.g., 2024)"
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
                    <MenuItem value="Recent">Recent</MenuItem>
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
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
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

                {/* Display Settings / Categorization */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'white' }}>
                    Display Settings
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.show_in_releases ?? true}
                          onChange={(e) => setFormData(prev => ({ ...prev, show_in_releases: e.target.checked }))}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#ff6b35'
                            }
                          }}
                        />
                      }
                      label="Show in Releases"
                      sx={{ color: 'white' }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.show_in_discography ?? false}
                          onChange={(e) => setFormData(prev => ({ ...prev, show_in_discography: e.target.checked }))}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&.Mui-checked': {
                              color: '#ff6b35'
                            }
                          }}
                        />
                      }
                      label="Show in Discography"
                      sx={{ color: 'white' }}
                    />
                  </Stack>
                  {!formData.show_in_releases && !formData.show_in_discography && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      This release will not appear on any public page.
                    </Alert>
                  )}
                </Box>

                {/* Streaming URLs */}
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'white' }}>
                  Audio Streaming Links
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
                    label="YouTube Music URL"
                    value={formData.youtube_music_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_music_url: e.target.value }))}
                    placeholder="https://music.youtube.com/..."
                  />
                </Stack>

                {/* Video Streaming Links */}
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'white' }}>
                  Video Streaming Links
                </Typography>
                
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="YouTube URL"
                    value={formData.youtube_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                    placeholder="https://www.youtube.com/..."
                  />
                  
                  <TextField
                    fullWidth
                    label="YouTube URL 2"
                    value={formData.youtube2_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube2_url: e.target.value }))}
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
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  {saving ? 'Saving...' : (isCreating ? 'Create Release' : 'Update Release')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  disabled={saving}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Paper>

          {/* Releases List Header and Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ color: 'white' }}>
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

          {/* Search Bar */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by title, artist, format, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{ 
                maxWidth: { xs: '100%', sm: 500 },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1
                    }
                  },
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.7)'
                  }
                }
              }}
            />
            {searchTerm && (
              <Button
                size="small"
                startIcon={<ClearIcon sx={{ color: 'white' }} />}
                onClick={handleClearSearch}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                Clear
              </Button>
            )}
            <Typography variant="body2" sx={{ color: 'white', whiteSpace: 'nowrap' }}>
              {filteredReleases.length} of {releases.length} releases
            </Typography>
          </Box>

          {/* Releases Table */}
          <Paper elevation={2} sx={{
            backgroundImage: 'url(/images/abstract-black-grunge-texture-scaled-900x120.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            maxHeight: '500px',
            overflow: 'auto',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1,
              pointerEvents: 'none'
            },
            '& .MuiTableContainer-root': {
              position: 'relative',
              zIndex: 2,
              backgroundColor: 'transparent'
            },
            '& .MuiTableCell-root': {
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            },
            '& .MuiTableHead .MuiTableCell-root': {
              fontWeight: 'bold',
              color: 'white'
            }
          }}>
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
                  ) : filteredReleases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary">
                          {searchTerm ? `No releases found matching "${searchTerm}".` : 'No releases found. Create your first release to get started.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReleases.map((release) => {
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
                          <Typography variant="subtitle2" fontWeight="medium" sx={{ color: 'white' }}>
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
                          {release.release_date ? 
                            (release.release_date.length === 4 ? 
                              release.release_date : // If it's just a year, display it directly
                              new Date(release.release_date).toLocaleDateString()
                            ) : 'TBD'
                          }
                        </TableCell>
                        <TableCell onClick={() => handleEditRelease(release)}>
                          <Chip
                            label={release.tag}
                            color={getTagColor(release.tag)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                              onClick={() => handleEditRelease(release)}
                              size="small"
                              title="Edit Release"
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  color: 'white',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to delete "${release.title}"? This action cannot be undone.`)) {
                                  try {
                                    const response = await fetch(`${getCurrentApiConfig().baseURL}/delete-release.php`, {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      credentials: 'include',
                                      body: JSON.stringify({ id: release.id })
                                    });
                                    
                                    const result = await response.json();
                                    
                                    if (result.success) {
                                      setSuccess(`Release "${result.title}" deleted successfully`);
                                      // Refresh the releases list
                                      fetchReleases();
                                    } else {
                                      setError(result.error || 'Failed to delete release');
                                    }
                                  } catch (error) {
                                    console.error('Delete error:', error);
                                    setError('Failed to delete release. Please try again.');
                                  }
                                }
                              }}
                              size="small"
                              title="Delete Release"
                              sx={{ 
                                color: 'rgba(255, 100, 100, 0.8)',
                                '&:hover': {
                                  color: 'rgb(255, 100, 100)',
                                  backgroundColor: 'rgba(255, 100, 100, 0.1)'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
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

      {/* Video Management Section */}
      <Box sx={{ mb: 4, display: activeTab === 1 ? 'block' : 'none' }}>
        <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
          <VideoIcon sx={{ mr: 2, color: 'white', fontSize: '2rem' }} />
          <Typography variant="h5" component="h2" fontWeight="medium" sx={{ color: 'white' }}>
            Manage Videos
          </Typography>
        </Box>
        
        {/* Video Form */}
        <Paper elevation={3} sx={{ 
          p: 4, 
          mb: 4,
          backgroundImage: 'url(/images/abstract-black-grunge-texture-scaled-900x120.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1
          },
          '& > *': {
            position: 'relative',
            zIndex: 2
          }
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            {isCreatingVideo ? 'Create New Video' : editingVideo ? `Edit: ${editingVideo?.title}` : 'Create New Video'}
          </Typography>
          
          <Stack spacing={3} sx={{ 
            mt: 2,
            '& .MuiTextField-root, & .MuiFormControl-root': {
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'transparent',
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(200, 200, 200, 0.8)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(200, 200, 200, 1)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: 'primary.main'
                }
              },
              '& .MuiInputBase-input': {
                color: 'white'
              }
            }
          }}>
            {/* Title and Artist Row */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Title *"
                value={videoFormData.title || ''}
                onChange={(e) => handleVideoInputChange('title', e.target.value)}
                required
              />
              
              <TextField
                fullWidth
                label="Artist *"
                value={videoFormData.artist || ''}
                onChange={(e) => handleVideoInputChange('artist', e.target.value)}
                required
              />
            </Stack>

            {/* YouTube URL */}
            <TextField
              fullWidth
              label="YouTube URL *"
              value={videoFormData.youtube_url || ''}
              onChange={(e) => handleVideoInputChange('youtube_url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              value={videoFormData.description || ''}
              onChange={(e) => handleVideoInputChange('description', e.target.value)}
              multiline
              rows={4}
              placeholder="Optional description for this video..."
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Form Actions */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleVideoSubmit}
              disabled={saving || !videoFormData.title || !videoFormData.artist || !videoFormData.youtube_url}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              {saving ? 'Saving...' : (isCreatingVideo ? 'Create Video' : 'Update Video')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancelVideoEdit}
              disabled={saving}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Paper>

        {/* All Videos List */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              All Videos
            </Typography>
            {!isCreatingVideo && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNewVideo}
                size="large"
              >
                Create New Video
              </Button>
            )}
          </Box>

          {/* Video Search Bar */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by artist, title, or YouTube URL..."
              value={videoSearchTerm}
              onChange={(e) => setVideoSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{ 
                maxWidth: { xs: '100%', sm: 500 },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& input': {
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1
                    }
                  },
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.7)'
                  }
                }
              }}
            />
            {videoSearchTerm && (
              <Button
                size="small"
                startIcon={<ClearIcon sx={{ color: 'white' }} />}
                onClick={handleClearVideoSearch}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                Clear
              </Button>
            )}
            <Typography variant="body2" sx={{ color: 'white', whiteSpace: 'nowrap' }}>
              {filteredVideos.length} of {videos.length} videos
            </Typography>
          </Box>

          <Paper elevation={2} sx={{
            backgroundImage: 'url(/images/abstract-black-grunge-texture-scaled-900x120.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            maxHeight: '500px',
            overflow: 'auto',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1,
              pointerEvents: 'none'
            },
            '& .MuiTableContainer-root': {
              position: 'relative',
              zIndex: 2,
              backgroundColor: 'transparent'
            },
            '& .MuiTableCell-root': {
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            },
            '& .MuiTableCell-head': {
              fontWeight: 'bold',
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }
          }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Artist</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>YouTube URL</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <CircularProgress sx={{ color: 'white' }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredVideos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {videos.length === 0 
                            ? 'No videos found. Create your first video above.'
                            : 'No videos match your search criteria.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVideos.map((video) => (
                      <TableRow 
                        key={video.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                          },
                          backgroundColor: editingVideo?.id === video.id ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                        }}
                      >
                        <TableCell>{video.artist}</TableCell>
                        <TableCell>{video.title}</TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 300, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: 'rgba(135, 206, 250, 0.9)'
                            }}
                          >
                            {video.youtube_url}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditVideo(video)}
                              sx={{ 
                                color: 'primary.light',
                                '&:hover': { color: 'primary.main' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteVideo(video)}
                              sx={{ 
                                color: 'error.light',
                                '&:hover': { color: 'error.main' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      {/* Homepage Videos Management Section */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
          <VideoIcon sx={{ mr: 2, color: 'success.main' }} />
          <Typography variant="h5" component="h2" fontWeight="medium" sx={{ color: 'white' }}>
            Homepage Videos
          </Typography>
        </Box>
        
        {/* Video-specific alerts */}
        {videoError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearVideoMessages}>
            {videoError}
          </Alert>
        )}
        
        {videoSuccess && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={clearVideoMessages}>
            {videoSuccess}
          </Alert>
        )}
        
        <Paper elevation={3} sx={{ 
          p: 4,
          backgroundImage: 'url(/images/abstract-black-grunge-texture-scaled-900x120.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1
          },
          '& > *': {
            position: 'relative',
            zIndex: 2
          }
        }}>
          <Typography variant="body1" sx={{ mb: 3, color: 'white' }}>
            Configure the 4 YouTube videos displayed on the homepage.
          </Typography>
          
          <Stack spacing={3} sx={{
            '& .MuiTextField-root, & .MuiFormControl-root': {
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'transparent',
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(200, 200, 200, 0.8)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(200, 200, 200, 1)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: 'primary.main'
                }
              },
              '& .MuiInputBase-input': {
                color: 'rgba(200, 200, 200, 0.8)',
                '&::placeholder': {
                  color: 'rgba(200, 200, 200, 0.8)',
                  opacity: 1
                }
              }
            }
          }}>
            {/* Video URL Fields in 2x2 Grid Layout */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Position 1 (Top Left)"
                placeholder="https://youtube.com/watch?v=..."
                value={homepageVideos[0] || ''}
                onChange={(e) => {
                  const newVideos = [...homepageVideos];
                  newVideos[0] = e.target.value;
                  setHomepageVideos(newVideos);
                }}
              />
              
              <TextField
                fullWidth
                label="Position 2 (Top Right)"
                placeholder="https://youtube.com/watch?v=..."
                value={homepageVideos[1] || ''}
                onChange={(e) => {
                  const newVideos = [...homepageVideos];
                  newVideos[1] = e.target.value;
                  setHomepageVideos(newVideos);
                }}
              />
            </Stack>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Position 3 (Bottom Left)"
                placeholder="https://youtube.com/watch?v=..."
                value={homepageVideos[2] || ''}
                onChange={(e) => {
                  const newVideos = [...homepageVideos];
                  newVideos[2] = e.target.value;
                  setHomepageVideos(newVideos);
                }}
              />
              
              <TextField
                fullWidth
                label="Position 4 (Bottom Right)"
                placeholder="https://youtube.com/watch?v=..."
                value={homepageVideos[3] || ''}
                onChange={(e) => {
                  const newVideos = [...homepageVideos];
                  newVideos[3] = e.target.value;
                  setHomepageVideos(newVideos);
                }}
              />
            </Stack>
            
            {/* Update Button */}
            <Box>
              <Button
                variant="contained"
                color="success"
                startIcon={videosSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleUpdateVideos}
                disabled={videosSaving}
                sx={{ mr: 2 }}
              >
                {videosSaving ? 'Saving Videos...' : 'Save Homepage Videos'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={fetchHomepageVideos}
                disabled={videosSaving}
              >
                Reset
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Other Dashboard Cards */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="medium" sx={{ color: 'white' }}>
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
                backgroundImage: 'url(/images/abstract-black-grunge-texture-scaled-900x120.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 1
                },
                '& > *': {
                  position: 'relative',
                  zIndex: 2
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  {React.cloneElement(card.icon, { 
                    sx: { fontSize: 40, color: 'secondary.main' }
                  })}
                  <Typography variant="h6" component="h3" sx={{ ml: 2, fontWeight: 'medium', color: 'white' }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => navigate(card.path)}
                  fullWidth
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  {card.action}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
    </LocalizationProvider>
  );
};

export default AdminDashboard;