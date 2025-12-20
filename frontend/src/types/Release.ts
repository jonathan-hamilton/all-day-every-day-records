import type { ReleaseArtist } from './Artist';
import type { Label } from './Label';
import type { StreamingLink } from './StreamingLink';

/**
 * Release type definitions for music releases
 * Maps to the releases table in the database schema
 */
export type ReleaseType = 'single' | 'ep' | 'album' | 'compilation' | 'mixtape' | 'remix';
export type ReleaseStatus = 'draft' | 'published' | 'archived';
export type ReleaseTag = 'None' | 'Featured' | 'New' | 'Recent' | 'Removed';

/**
 * Basic release entity type definition
 * Maps to the releases table structure
 */
export interface Release {
  id: number;
  title: string;
  description?: string;
  release_date?: string;
  release_type: ReleaseType;
  catalog_number?: string;
  label_id?: number;
  cover_image_url?: string;
  bandcamp_url?: string;
  bandcamp_id?: string;
  duration_seconds?: number;
  track_count: number;
  is_featured: boolean;
  display_order: number;
  status: ReleaseStatus;
  tag: ReleaseTag;
  show_in_releases: boolean;
  show_in_discography: boolean;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  twitter_url?: string;
  audio_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Extended release with populated relationship data
 * Includes related artists, label, and streaming links
 */
export interface ReleaseWithDetails extends Release {
  label?: Label;
  artists: ReleaseArtist[];
  streaming_links: StreamingLink[];
}

/**
 * Release overview data structure  
 * Maps to the release_overview database view
 */
export interface ReleaseOverview {
  id: number;
  title: string;
  description?: string;
  release_date?: string;
  release_type: ReleaseType;
  cover_image_url?: string;
  bandcamp_url?: string;
  duration_seconds?: number;
  track_count: number;
  is_featured: boolean;
  display_order: number;
  status: ReleaseStatus;
  tag: ReleaseTag;
  created_at: string;
  updated_at: string;
  label_name?: string;
  label_slug?: string;
  artists_with_roles?: string; // Concatenated string from database view
  available_platforms?: string; // Comma-separated string from database view
  spotify_url?: string;
  apple_music_url?: string;
  amazon_music_url?: string;
  youtube_url?: string;
  showInReleases: boolean; // Display on Releases page
  showInDiscography: boolean; // Display on Discography page
}

/**
 * Release form data for creating/editing releases
 * Subset of Release fields that are user-editable
 */
export interface ReleaseFormData {
  title: string;
  description?: string;
  release_date?: string;
  release_type: ReleaseType;
  label_id?: number;
  cover_image_url?: string;
  bandcamp_url?: string;
  bandcamp_id?: string;
  duration_seconds?: number;
  track_count: number;
  is_featured: boolean;
  display_order: number;
  tag: ReleaseTag;
}

/**
 * Release carousel slide data
 * Type-safe interface for carousel component props
 */
export interface ReleaseCarouselSlide {
  id: number;
  title: string;
  cover_image_url?: string;
  release_date?: string;
  release_type: ReleaseType;
  label_name?: string;
  artists_with_roles?: string;
  bandcamp_url?: string;
  tag: ReleaseTag;
}