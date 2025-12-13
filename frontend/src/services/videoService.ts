/**
 * Video API Service
 * 
 * Provides type-safe access to video-related API endpoints.
 * Maps to the PHP backend endpoints for video operations.
 */

import type { ApiService } from './apiService';
import type { 
  Video,
  VideoWithRelated,
  ApiVideosResponse,
  ApiVideoByIdResponse
} from '../types';

/**
 * Video form data for create/update operations
 */
export interface VideoFormData {
  id?: number;
  title: string;
  youtube_url: string;
  description?: string | null;
  artist: string;
}

/**
 * Video service class providing typed API methods
 */
export class VideoService {
  constructor(private readonly apiService: ApiService) {}

  /**
   * Get all videos sorted by artist, then title
   */
  async getVideos(): Promise<Video[]> {
    try {
      const response = await this.apiService.get<ApiVideosResponse>('/get-videos.php');
      return response?.videos || [];
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  /**
   * Get single video by ID with related videos by same artist
   */
  async getVideoById(id: number): Promise<VideoWithRelated> {
    try {
      const response = await this.apiService.get<ApiVideoByIdResponse>(
        `/get-video-by-id.php?id=${id}`
      );
      
      return {
        video: response.video,
        relatedVideos: response.relatedVideos || []
      };
    } catch (error) {
      console.error(`Error fetching video ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create or update a video (admin only)
   */
  async upsertVideo(videoData: VideoFormData): Promise<{ success: boolean; video_id: number }> {
    try {
      const response = await this.apiService.post<{ 
        success: boolean; 
        message: string;
        video_id: number;
      }>('/upsert-video.php', videoData);
      
      return {
        success: response.success,
        video_id: response.video_id
      };
    } catch (error) {
      console.error('Error upserting video:', error);
      throw error;
    }
  }

  /**
   * Delete a video by ID (admin only)
   */
  async deleteVideo(id: number): Promise<{ success: boolean }> {
    try {
      const response = await this.apiService.post<{ 
        success: boolean; 
        message: string;
      }>('/delete-video.php', { id });
      
      return {
        success: response.success
      };
    } catch (error) {
      console.error(`Error deleting video ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Factory function to create a configured VideoService instance
 */
export function createVideoService(apiService: ApiService): VideoService {
  return new VideoService(apiService);
}
