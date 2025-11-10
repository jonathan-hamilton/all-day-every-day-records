import { Release } from '../types/Release';

// Filter releases by search term (artist or title)
export const filterBySearch = (releases: Release[], searchTerm: string): Release[] => {
  if (!searchTerm.trim()) return releases;
  
  const term = searchTerm.toLowerCase().trim();
  return releases.filter(release =>
    release.artist.toLowerCase().includes(term) ||
    release.title.toLowerCase().includes(term)
  );
};