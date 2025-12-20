import React, { useRef, useState } from 'react';
import { Stack, Button, Box } from '@mui/material';

interface AlphabeticalNavProps {
  availableLetters: string[];
  activeLetter: string;
  onLetterClick: (letter: string) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

export const AlphabeticalNav: React.FC<AlphabeticalNavProps> = ({
  availableLetters,
  activeLetter,
  onLetterClick
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const dragThreshold = 5; // pixels to move before it counts as a drag

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!scrollRef.current || startY === 0) return;
    const y = e.pageY - scrollRef.current.offsetTop;
    const distance = Math.abs(y - startY);
    
    // Only set dragging if moved beyond threshold
    if (distance > dragThreshold) {
      setIsDragging(true);
      e.preventDefault();
      const walk = (y - startY) * 2; // Scroll speed multiplier
      scrollRef.current.scrollTop = scrollTop - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartY(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setStartY(e.touches[0].pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current || startY === 0) return;
    const y = e.touches[0].pageY - scrollRef.current.offsetTop;
    const distance = Math.abs(y - startY);
    
    // Only set dragging if moved beyond threshold
    if (distance > dragThreshold) {
      setIsDragging(true);
      const walk = (y - startY) * 2; // Scroll speed multiplier
      scrollRef.current.scrollTop = scrollTop - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setStartY(0);
  };

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
        ref={scrollRef}
        direction="column"
        spacing={{ xs: 0.25, sm: 0.5 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: 2,
          padding: { xs: 0.5, sm: 1 },
          backdropFilter: 'blur(8px)',
          maxHeight: 400,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          // Hide scrollbar
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          '&::-webkit-scrollbar': {
            display: 'none' // Chrome/Safari
          }
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
              aria-label={`Filter by ${letter}`}
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
                    : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.2s ease-in-out',
                pointerEvents: isDragging ? 'none' : 'auto', // Prevent clicks while dragging
                '&:hover': {
                  backgroundColor: isAvailable
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'transparent',
                  transform: isAvailable ? 'scale(1.1)' : 'none'
                },
                '&:disabled': {
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
