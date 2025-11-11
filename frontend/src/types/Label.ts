/**
 * Record label entity type definition
 * Maps to the labels table in the database schema
 */
export interface Label {
  id: number;
  name: string;
  slug: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  founded_year?: number;
  contact_email?: string;
  social_media?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}