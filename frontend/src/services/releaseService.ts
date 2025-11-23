/**
 * Release API Service
 * 
 * Provides type-safe access to release-related API endpoints.
 * Maps to the PHP backend endpoints for release operations.
 */

import type { ApiService } from './apiService';
import type { 
  ReleaseWithDetails, 
  ReleaseOverview,
  ReleaseCarouselSlide,
  ReleaseType,
  ReleaseStatus,
  ReleaseTag
} from '../types';

/**
 * API response format from PHP backend
 */
interface ApiReleaseResponse {
  success: boolean;
  releases: Array<{
    id: number;
    title: string;
    artist?: string;
    artists?: string;
    description?: string;
    release_date?: string;
    format?: string;
    cover_image_url?: string;
    spotify_url?: string;
    apple_music_url?: string;
    amazon_music_url?: string;
    youtube_url?: string;
    tag?: string;
    created_at?: string;
    updated_at?: string;
    slug?: string;
    track_count?: number;
    display_order?: number;
  }>;
}

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

      const endpoint = '/get-releases.php';
      const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      // The PHP endpoint returns an object with success and releases properties
      const response = await this.apiService.get<ApiReleaseResponse>(url);
      
      // Extract the releases array from the response
      const releases = response?.releases || [];
      
      // Ensure we always return an array and map fields to expected format
      if (Array.isArray(releases)) {
        return releases.map(release => ({
          ...release,
          // Map API fields to expected frontend fields
          artists_with_roles: release.artists || release.artist || '',
          release_type: (release.format || 'album') as ReleaseType,
          is_featured: release.tag === 'Featured',
          status: (release.tag === 'Removed' ? 'archived' : 'published') as ReleaseStatus,
          tag: (release.tag || 'None') as ReleaseTag,
          // Ensure required fields have defaults
          slug: release.slug || `release-${release.id}`,
          track_count: release.track_count || 1,
          display_order: release.display_order || 0,
          created_at: release.created_at || new Date().toISOString(),
          updated_at: release.updated_at || new Date().toISOString(),
        } satisfies ReleaseOverview));
      }
      
      return [];
      
    } catch (error) {
      console.error('Error fetching releases:', error);
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
   * Get featured releases for carousel (alias for backwards compatibility)
   */
  async getFeaturedReleasesForCarousel(limit = 8): Promise<ReleaseCarouselSlide[]> {
    return this.getReleasesForCarousel({ limit, tag: 'Featured' });
  }

  /**
   * Get releases for carousel display with optional filtering by tag
   * Returns carousel-specific data structure with only needed fields
   * Maps to: GET /get-releases.php
   */
  async getReleasesForCarousel(options?: { limit?: number; tag?: string }): Promise<ReleaseCarouselSlide[]> {
    const { limit = 8, tag } = options || {};
    
    try {
      // Make direct API call to get all releases
      const response = await this.apiService.get<ReleaseOverview[]>('/get-releases.php');
      
      // The API returns releases directly, not wrapped in a data object
      let releases: ReleaseOverview[] = response;
      
      // Handle case where API returns an object with releases property
      if (response && typeof response === 'object' && 'releases' in response) {
        releases = (response as { releases: ReleaseOverview[] }).releases;
      }
      
      // Ensure we have an array
      if (!Array.isArray(releases)) {
        console.warn('API did not return an array of releases:', releases);
        return [];
      }
      
      // Filter by tag if specified
      if (tag && tag !== 'None') {
        releases = releases.filter((release) => {
          // Type assertion for tag property that may exist on API response
          return (release as ReleaseOverview & { tag?: string }).tag === tag;
        });
      }
      
      // Limit results
      releases = releases.slice(0, limit);
      
      // Map to carousel-specific interface for type safety
      return releases.map((release) => ({
        id: release.id,
        title: release.title,
        slug: release.slug || '',
        cover_image_url: release.cover_image_url,
        release_date: release.release_date,
        release_type: release.release_type || 'album',
        label_name: release.label_name || 'All Day Every Day Records',
        artists_with_roles: release.artists_with_roles || '',
        bandcamp_url: release.bandcamp_url || '',
        tag: (release as ReleaseOverview & { tag?: string }).tag || 'None'
      }));
      
    } catch (error) {
      console.error('Error fetching releases for carousel:', error);
      return [];
    }
  }

  /**
   * Get new releases for homepage carousel
   * Fetches releases with tag='New' for display in the homepage carousel
   */
  async getNewReleasesForCarousel(limit = 8): Promise<ReleaseCarouselSlide[]> {
    return this.getReleasesForCarousel({ limit, tag: 'New' });
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
      const response = await this.apiService.get<{ success: boolean; release: ReleaseWithDetails }>(`/get-releases-by-id.php?id=${id}`);
      
      // Handle wrapped response from API
      const release = response.success ? response.release : response as any;
      
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