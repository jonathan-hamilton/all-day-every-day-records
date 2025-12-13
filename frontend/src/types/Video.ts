/**
 * Video content type for standalone Videos system
 */
export interface Video {
  id: number;
  title: string;
  youtube_url: string;
  description: string | null;
  artist: string;
  created_at: string;
  updated_at: string;
}

/**
 * Video detail response with related videos
 */
export interface VideoWithRelated {
  video: Video;
  relatedVideos: Video[];
}

/**
 * API response format from get-videos.php endpoint
 */
export interface ApiVideosResponse {
  success: boolean;
  videos: Video[];
}

/**
 * API response format from get-video-by-id.php endpoint
 */
export interface ApiVideoByIdResponse {
  success: boolean;
  video: Video;
  relatedVideos: Video[];
}
