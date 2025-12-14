/**
 * Video Management Dialog Component
 * 
 * Admin-only dialog for managing the 4 YouTube videos displayed on the homepage.
 * Provides a 2x2 grid layout for editing video URLs with validation.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { YouTube as YouTubeIcon } from '@mui/icons-material';

interface VideoManageDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (videoUrls: string[]) => Promise<void>;
  currentVideos?: string[];
}

interface FormState {
  loading: boolean;
  saving: boolean;
  error: string | null;
  videos: {
    position1: string;
    position2: string;
    position3: string;
    position4: string;
  };
}

export const VideoManageDialog: React.FC<VideoManageDialogProps> = ({
  open,
  onClose,
  onSave,
  currentVideos = ['', '', '', '']
}) => {
  const [state, setState] = useState<FormState>({
    loading: false,
    saving: false,
    error: null,
    videos: {
      position1: '',
      position2: '',
      position3: '',
      position4: ''
    }
  });

  // Load current videos when dialog opens
  useEffect(() => {
    if (open && currentVideos) {
      setState(prev => ({
        ...prev,
        videos: {
          position1: currentVideos[0] || '',
          position2: currentVideos[1] || '',
          position3: currentVideos[2] || '',
          position4: currentVideos[3] || ''
        },
        error: null
      }));
    }
  }, [open, currentVideos]);

  // YouTube URL validation
  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty URLs are allowed
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url.trim());
  };

  // Handle form input changes
  const handleVideoChange = (position: keyof FormState['videos'], value: string) => {
    setState(prev => ({
      ...prev,
      videos: {
        ...prev.videos,
        [position]: value
      },
      error: null
    }));
  };

  // Validate all URLs
  const validateUrls = (): boolean => {
    const urlEntries = Object.entries(state.videos);
    
    for (const [position, url] of urlEntries) {
      if (url.trim() && !isValidYouTubeUrl(url)) {
        const positionNumber = position.replace('position', '');
        setState(prev => ({
          ...prev,
          error: `Invalid YouTube URL in position ${positionNumber}. Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=...)`
        }));
        return false;
      }
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateUrls()) return;
    
    setState(prev => ({ ...prev, saving: true, error: null }));
    
    try {
      const videoUrls = Object.values(state.videos);
      await onSave(videoUrls);
      onClose();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to save videos'
      }));
    } finally {
      setState(prev => ({ ...prev, saving: false }));
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setState(prev => ({
      ...prev,
      error: null
    }));
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 2 }}>
        <YouTubeIcon color="error" />
        Manage Homepage Videos
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure the 4 YouTube videos displayed on the homepage. Videos are arranged in a 2x2 grid layout.
          Leave fields empty to keep current videos unchanged.
        </Typography>

        {state.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {state.error}
          </Alert>
        )}

        {/* 2x2 Grid Layout */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Video Grid Layout
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 3 
          }}>
            {/* Position 1 - Top Left */}
            <TextField
              fullWidth
              label="Position 1 (Top Left)"
              placeholder="https://youtube.com/watch?v=..."
              value={state.videos.position1}
              onChange={(e) => handleVideoChange('position1', e.target.value)}
              error={state.videos.position1.trim() !== '' && !isValidYouTubeUrl(state.videos.position1)}
              helperText={
                state.videos.position1.trim() !== '' && !isValidYouTubeUrl(state.videos.position1)
                  ? 'Invalid YouTube URL'
                  : 'Top left position on desktop'
              }
              sx={{ mb: 2 }}
            />
            
            {/* Position 2 - Top Right */}
            <TextField
              fullWidth
              label="Position 2 (Top Right)"
              placeholder="https://youtube.com/watch?v=..."
              value={state.videos.position2}
              onChange={(e) => handleVideoChange('position2', e.target.value)}
              error={state.videos.position2.trim() !== '' && !isValidYouTubeUrl(state.videos.position2)}
              helperText={
                state.videos.position2.trim() !== '' && !isValidYouTubeUrl(state.videos.position2)
                  ? 'Invalid YouTube URL'
                  : 'Top right position on desktop'
              }
              sx={{ mb: 2 }}
            />

            {/* Position 3 - Bottom Left */}
            <TextField
              fullWidth
              label="Position 3 (Bottom Left)"
              placeholder="https://youtube.com/watch?v=..."
              value={state.videos.position3}
              onChange={(e) => handleVideoChange('position3', e.target.value)}
              error={state.videos.position3.trim() !== '' && !isValidYouTubeUrl(state.videos.position3)}
              helperText={
                state.videos.position3.trim() !== '' && !isValidYouTubeUrl(state.videos.position3)
                  ? 'Invalid YouTube URL'
                  : 'Bottom left position on desktop'
              }
              sx={{ mb: 2 }}
            />
            
            {/* Position 4 - Bottom Right */}
            <TextField
              fullWidth
              label="Position 4 (Bottom Right)"
              placeholder="https://youtube.com/watch?v=..."
              value={state.videos.position4}
              onChange={(e) => handleVideoChange('position4', e.target.value)}
              error={state.videos.position4.trim() !== '' && !isValidYouTubeUrl(state.videos.position4)}
              helperText={
                state.videos.position4.trim() !== '' && !isValidYouTubeUrl(state.videos.position4)
                  ? 'Invalid YouTube URL'
                  : 'Bottom right position on desktop'
              }
              sx={{ mb: 2 }}
            />
          </Box>
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Supported URL formats:</strong><br />
            • https://youtube.com/watch?v=VIDEO_ID<br />
            • https://youtu.be/VIDEO_ID<br />
            • https://youtube.com/embed/VIDEO_ID
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleCancel} disabled={state.saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={state.saving}
          startIcon={state.saving ? <CircularProgress size={16} /> : null}
        >
          {state.saving ? 'Saving...' : 'Save Videos'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoManageDialog;