import React from 'react';
import { Stack, Button, Box } from '@mui/material';

interface AlphabeticalNavProps {
  availableLetters: string[];
  activeLetter: string;
  onLetterClick: (letter: string) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const AlphabeticalNav: React.FC<AlphabeticalNavProps> = ({
  availableLetters,
  activeLetter,
  onLetterClick
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 8, sm: 16, md: 24 },
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: { xs: 'none', sm: 'flex' }
      }}
    >
      <Stack
        direction="column"
        spacing={{ xs: 0.25, sm: 0.5 }}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: 2,
          padding: { xs: 0.5, sm: 1 },
          backdropFilter: 'blur(8px)'
        }}
      >
        {ALPHABET.map((letter) => {
          const isAvailable = availableLetters.includes(letter);
          const isActive = activeLetter === letter;

          return (
            <Button
              key={letter}
              onClick={() => isAvailable && onLetterClick(letter)}
              disabled={!isAvailable}
              aria-label={`Jump to ${letter}`}
              sx={{
                minWidth: { xs: 24, sm: 32, md: 40 },
                width: { xs: 24, sm: 32, md: 40 },
                height: { xs: 24, sm: 32, md: 40 },
                padding: 0,
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                fontWeight: isActive ? 'bold' : 'normal',
                backgroundColor: 'transparent',
                color: isActive
                  ? 'red'
                  : isAvailable
                    ? 'white'
                    : 'text.disabled',
                opacity: isAvailable ? 1 : 0.3,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: isAvailable
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'transparent',
                  transform: isAvailable ? 'scale(1.1)' : 'none'
                },
                '&:disabled': {
                  color: 'text.disabled',
                  cursor: 'not-allowed'
                }
              }}
            >
              {letter}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default AlphabeticalNav;
