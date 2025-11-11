import type { ReleaseArtist } from './Artist';
import type { Label } from './Label';
import type { StreamingLink } from './StreamingLink';

/**
 * Release type definitions for music releases
 * Maps to the releases table in the database schema
 */
export type ReleaseType = 'single' | 'ep' | 'album' | 'compilation' | 'mixtape' | 'remix';
export type ReleaseStatus = 'draft' | 'published' | 'archived';

/**
 * Basic release entity type definition
 * Maps to the releases table structure
 */
export interface Release {
  id: number;
  title: string;
  slug: string;
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
  metadata?: Record<string, any>;
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
  slug: string;
  description?: string;
  release_date?: string;
  release_type: ReleaseType;
  catalog_number?: string;
  cover_image_url?: string;
  bandcamp_url?: string;
  duration_seconds?: number;
  track_count: number;
  is_featured: boolean;
  display_order: number;
  status: ReleaseStatus;
  created_at: string;
  updated_at: string;
  label_name?: string;
  label_slug?: string;
  artists_with_roles?: string; // Concatenated string from database view
  available_platforms?: string; // Comma-separated string from database view
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
  catalog_number?: string;
  label_id?: number;
  cover_image_url?: string;
  bandcamp_url?: string;
  bandcamp_id?: string;
  duration_seconds?: number;
  track_count: number;
  is_featured: boolean;
  display_order: number;
}