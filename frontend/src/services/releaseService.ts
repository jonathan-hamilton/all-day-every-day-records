/**
 * Release API Service
 * 
 * Provides type-safe access to release-related API endpoints.
 * Maps to the PHP backend endpoints for release operations.
 */

import type { ApiService } from './apiService';
import type { 
  ReleaseWithDetails, 
  ReleaseOverview 
} from '../types';

/**
 * Query parameters for release listing endpoints
 */
export interface GetReleasesParams {
  limit?: number;
  offset?: number;
  featured?: boolean;
  release_type?: string;
  status?: 'published' | 'draft' | 'archived';
  artist_id?: number;
  label_id?: number;
  search?: string;
  sort?: 'release_date' | 'title' | 'created_at' | 'display_order';
  order?: 'asc' | 'desc';
}

/**
 * Release service class providing typed API methods
 */
export class ReleaseService {
  constructor(private readonly apiService: ApiService) {}

  /**
   * Get all releases with optional filtering
   * Maps to: GET /get-releases.php
   */
  async getReleases(params?: GetReleasesParams): Promise<ReleaseOverview[]> {
    try {
      // Convert parameters to query string format expected by PHP backend
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      const url = `/get-releases.php${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // The PHP endpoint returns an array directly, not wrapped in ApiResponse
      const releases = await this.apiService.get<ReleaseOverview[]>(url);
      
      // Ensure we always return an array
      return Array.isArray(releases) ? releases : [];
      
    } catch (error) {
      console.error('Error fetching releases:', error);
      // Return empty array on error to prevent UI crashes
      return [];
    }
  }

  /**
   * Get featured releases for homepage display
   * Maps to: GET /get-releases.php?featured=true
   */
  async getFeaturedReleases(limit = 6): Promise<ReleaseOverview[]> {
    return this.getReleases({ 
      featured: true, 
      limit,
      status: 'published',
      sort: 'display_order',
      order: 'asc'
    });
  }

  /**
   * Get latest releases
   * Maps to: GET /get-releases.php?sort=release_date&order=desc
   */
  async getLatestReleases(limit = 10): Promise<ReleaseOverview[]> {
    return this.getReleases({ 
      limit,
      status: 'published',
      sort: 'release_date',
      order: 'desc'
    });
  }

  /**
   * Get release by ID with full details
   * Maps to: GET /get-releases-by-id.php?id={id}
   */
  async getReleaseById(id: number): Promise<ReleaseWithDetails | null> {
    try {
      const release = await this.apiService.get<ReleaseWithDetails>(`/get-releases-by-id.php?id=${id}`);
      
      // Ensure the release has the expected structure
      if (!release || typeof release !== 'object') {
        return null;
      }

      // Provide defaults for required arrays if missing
      return {
        ...release,
        artists: release.artists || [],
        streaming_links: release.streaming_links || []
      };
      
    } catch (error) {
      console.error(`Error fetching release ${id}:`, error);
      return null;
    }
  }

  /**
   * Get release by slug for SEO-friendly URLs
   * Maps to: GET /get-releases-by-id.php?slug={slug}
   */
  async getReleaseBySlug(slug: string): Promise<ReleaseWithDetails | null> {
    try {
      const release = await this.apiService.get<ReleaseWithDetails>(`/get-releases-by-id.php?slug=${encodeURIComponent(slug)}`);
      
      if (!release || typeof release !== 'object') {
        return null;
      }

      return {
        ...release,
        artists: release.artists || [],
        streaming_links: release.streaming_links || []
      };
      
    } catch (error) {
      console.error(`Error fetching release by slug ${slug}:`, error);
      return null;
    }
  }

  /**
   * Search releases by title or artist name
   * Maps to: GET /get-releases.php?search={query}
   */
  async searchReleases(query: string, limit = 20): Promise<ReleaseOverview[]> {
    if (!query.trim()) {
      return [];
    }

    return this.getReleases({ 
      search: query.trim(),
      limit,
      status: 'published',
      sort: 'release_date',
      order: 'desc'
    });
  }

  /**
   * Get releases by artist ID
   * Maps to: GET /get-releases.php?artist_id={artistId}
   */
  async getReleasesByArtist(artistId: number, limit?: number): Promise<ReleaseOverview[]> {
    return this.getReleases({ 
      artist_id: artistId,
      limit,
      status: 'published',
      sort: 'release_date',
      order: 'desc'
    });
  }

  /**
   * Get releases by label ID
   * Maps to: GET /get-releases.php?label_id={labelId}
   */
  async getReleasesByLabel(labelId: number, limit?: number): Promise<ReleaseOverview[]> {
    return this.getReleases({ 
      label_id: labelId,
      limit,
      status: 'published',
      sort: 'release_date',
      order: 'desc'
    });
  }

  /**
   * Get releases by type (single, ep, album, etc.)
   * Maps to: GET /get-releases.php?release_type={type}
   */
  async getReleasesByType(type: string, limit?: number): Promise<ReleaseOverview[]> {
    return this.getReleases({ 
      release_type: type,
      limit,
      status: 'published',
      sort: 'release_date',
      order: 'desc'
    });
  }
}

/**
 * Factory function to create release service instance
 */
export function createReleaseService(apiService: ApiService): ReleaseService {
  return new ReleaseService(apiService);
}