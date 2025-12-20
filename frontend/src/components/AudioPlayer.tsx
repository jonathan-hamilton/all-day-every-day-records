import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { VolumeUp as VolumeUpIcon } from '@mui/icons-material';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      // Loop: restart from beginning
      audio.currentTime = 0;
      audio.play();
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      // Pause audio when component unmounts
      audio.pause();
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  return (
    <>
      {/* Audio element (hidden) */}
      <audio ref={audioRef} src={audioUrl} loop />

      {/* Speaker icon button */}
      <Tooltip title={isPlaying ? 'Pause audio preview' : 'Play audio preview'} arrow>
        <IconButton
          onClick={togglePlay}
          sx={{
            color: '#ff0000', // Red theme color
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#cc0000',
              transform: 'scale(1.1)',
            },
            // Pulsing animation when playing
            ...(isPlaying && {
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
                '50%': {
                  opacity: 0.7,
                  transform: 'scale(1.1)',
                },
              },
            }),
          }}
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          <VolumeUpIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default AudioPlayer;
