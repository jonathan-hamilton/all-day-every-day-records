import { createContext, useContext, useState, ReactNode } from "react";

export interface Release {
  id: string;
  cover_image_url: string;
  artist: string;
  title: string;
  description?: string;
  release_date?: string;
  spotify_url?: string;
  apple_music_url?: string;
  amazon_music_url?: string;
  youtube_url?: string;
}

interface ReleaseContextType {
  releases: Release[];
  setReleases: (releases: Release[]) => void;
}

const ReleaseContext = createContext<ReleaseContextType | undefined>(undefined);

export function ReleaseProvider({ children }: { children: ReactNode }) {
  const [releases, setReleases] = useState<Release[]>([]);
  return (
    <ReleaseContext.Provider value={{ releases, setReleases }}>
      {children}
    </ReleaseContext.Provider>
  );
}

export function useReleases() {
  const context = useContext(ReleaseContext);
  if (!context) {
    throw new Error("useReleases must be used within a ReleaseProvider");
  }
  return context;
}
