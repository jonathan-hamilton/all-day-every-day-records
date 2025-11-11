/**
 * Artist entity type definition
 * Maps to the artists table in the database schema
 */
export interface Artist {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  image_url?: string;
  website_url?: string;
  social_media?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Artist with role information for release contexts
 * Used when artists are associated with releases
 */
export interface ReleaseArtist extends Artist {
  role: 'primary' | 'featured' | 'remixer' | 'producer' | 'collaborator';
  display_order: number;
}