export type Release = {
    id: number;
    title: string;
    artist: string;
    label: string;
    format: string;
    release_date: string;
    cover_image_url: string;
    description: string;
    spotify_url?: string;
    youtube_url?: string;
    apple_music_url?: string;
    amazon_music_url?: string;
    tag?: string;
  };
  