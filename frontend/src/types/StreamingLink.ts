/**
 * Streaming platform link type definition
 * Maps to the streaming_links table in the database schema
 */
export interface StreamingLink {
  id: number;
  release_id: number;
  platform: string;
  url: string;
  platform_release_id?: string;
  platform_data?: Record<string, any>;
  is_active: boolean;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}