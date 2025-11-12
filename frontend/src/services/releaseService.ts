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
  ReleaseCarouselSlide 
} from '../types';

// Static seed data for development/demo purposes
const SEED_RELEASES: ReleaseOverview[] = [
  {
    id: 1,
    title: 'Midnight Chronicles',
    slug: 'midnight-chronicles',
    description: 'A dark and atmospheric journey through urban landscapes',
    release_date: '2024-03-15',
    release_type: 'album',
    catalog_number: 'ADER001',
    cover_image_url: '/images/nd-releases/midnight-chronicles.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/midnight-chronicles',
    duration_seconds: 2847,
    track_count: 12,
    is_featured: true,
    display_order: 1,
    status: 'published',
    label_name: 'All Day Every Day Records',
    label_slug: 'all-day-every-day-records',
    artists_with_roles: 'MC Shadow (vocals), DJ Eclipse (production)',
    available_platforms: 'Bandcamp,Spotify,Apple Music',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-15T15:30:00Z'
  },
  {
    id: 2,
    title: 'Street Symphony',
    slug: 'street-symphony',
    description: 'Raw beats and authentic storytelling from the streets',
    release_date: '2024-02-28',
    release_type: 'ep',
    catalog_number: 'ADER002',
    cover_image_url: '/images/nd-releases/street-symphony.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/street-symphony',
    duration_seconds: 1456,
    track_count: 6,
    is_featured: true,
    display_order: 2,
    status: 'published',
    label_name: 'All Day Every Day Records',
    label_slug: 'all-day-every-day-records',
    artists_with_roles: 'Lyrical Genius (vocals, lyrics), Beat Master B (production)',
    available_platforms: 'Bandcamp,Spotify,YouTube Music',
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-02-28T12:15:00Z'
  },
  {
    id: 3,
    title: 'Underground Anthems',
    slug: 'underground-anthems',
    description: 'Classic hip-hop vibes with modern production',
    release_date: '2024-01-20',
    release_type: 'single',
    catalog_number: 'ADER003',
    cover_image_url: '/images/nd-releases/underground-anthems.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/track/underground-anthems',
    duration_seconds: 234,
    track_count: 1,
    is_featured: true,
    display_order: 3,
    status: 'published',
    label_name: 'All Day Every Day Records',
    label_slug: 'all-day-every-day-records',
    artists_with_roles: 'Urban Prophet (vocals), Classic Cuts (scratching)',
    available_platforms: 'Bandcamp,Spotify,Apple Music,YouTube Music',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-20T16:45:00Z'
  },
  {
    id: 4,
    title: 'Concrete Dreams',
    slug: 'concrete-dreams',
    description: 'Introspective lyrics over jazz-influenced beats',
    release_date: '2024-04-10',
    release_type: 'album',
    catalog_number: 'ADER004',
    cover_image_url: '/images/nd-releases/concrete-dreams.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/concrete-dreams',
    duration_seconds: 3156,
    track_count: 14,
    is_featured: true,
    display_order: 4,
    status: 'published',
    label_name: 'Nickel & Dime Records',
    label_slug: 'nickel-and-dime-records',
    artists_with_roles: 'Smooth Operator (vocals), Jazz Hands (piano, production)',
    available_platforms: 'Bandcamp,Spotify',
    created_at: '2024-02-01T11:00:00Z',
    updated_at: '2024-04-10T14:20:00Z'
  },
  {
    id: 5,
    title: 'City Lights',
    slug: 'city-lights',
    description: 'Night-time vibes and urban exploration',
    release_date: '2024-05-15',
    release_type: 'ep',
    catalog_number: 'ADER005',
    cover_image_url: '/images/nd-releases/city-lights.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/city-lights',
    duration_seconds: 1823,
    track_count: 7,
    is_featured: true,
    display_order: 5,
    status: 'published',
    label_name: 'Triple X Records',
    label_slug: 'triple-x-records',
    artists_with_roles: 'Night Walker (vocals), Neon Beats (production, mixing)',
    available_platforms: 'Bandcamp,Apple Music,YouTube Music',
    created_at: '2024-03-01T13:00:00Z',
    updated_at: '2024-05-15T10:30:00Z'
  },
  {
    id: 6,
    title: 'Raw Energy',
    slug: 'raw-energy',
    description: 'High-energy tracks for the club scene',
    release_date: '2024-06-01',
    release_type: 'mixtape',
    catalog_number: 'ADER006',
    cover_image_url: '/images/nd-releases/raw-energy.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/raw-energy',
    duration_seconds: 2234,
    track_count: 10,
    is_featured: true,
    display_order: 6,
    status: 'published',
    label_name: 'All Day Every Day Records',
    label_slug: 'all-day-every-day-records',
    artists_with_roles: 'Energy MC (vocals), Pump It Up (production)',
    available_platforms: 'Bandcamp,Spotify,Apple Music,YouTube Music',
    created_at: '2024-04-01T16:00:00Z',
    updated_at: '2024-06-01T18:00:00Z'
  },
  {
    id: 7,
    title: 'Reflections',
    slug: 'reflections',
    description: 'Contemplative rhymes over ambient soundscapes',
    release_date: '2024-07-20',
    release_type: 'single',
    catalog_number: 'ADER007',
    cover_image_url: '/images/nd-releases/reflections.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/track/reflections',
    duration_seconds: 287,
    track_count: 1,
    is_featured: true,
    display_order: 7,
    status: 'published',
    label_name: 'Ransom Note Records',
    label_slug: 'ransom-note-records',
    artists_with_roles: 'Deep Thinker (vocals, lyrics), Ambient Soul (production)',
    available_platforms: 'Bandcamp,Spotify',
    created_at: '2024-06-01T12:00:00Z',
    updated_at: '2024-07-20T14:15:00Z'
  },
  {
    id: 8,
    title: 'Block Party',
    slug: 'block-party',
    description: 'Community celebration with old-school flavor',
    release_date: '2024-08-05',
    release_type: 'compilation',
    catalog_number: 'ADER008',
    cover_image_url: '/images/nd-releases/block-party.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/block-party',
    duration_seconds: 4567,
    track_count: 20,
    is_featured: true,
    display_order: 8,
    status: 'published',
    label_name: 'All Day Every Day Records',
    label_slug: 'all-day-every-day-records',
    artists_with_roles: 'Various Artists (Community Collective)',
    available_platforms: 'Bandcamp,Spotify,Apple Music,YouTube Music',
    created_at: '2024-05-01T10:00:00Z',
    updated_at: '2024-08-05T20:30:00Z'
  }
];

// Detailed seed data for release detail pages
const SEED_RELEASE_DETAILS: ReleaseWithDetails[] = [
  {
    id: 1,
    title: 'Midnight Chronicles',
    slug: 'midnight-chronicles',
    description: 'A dark and atmospheric journey through urban landscapes, featuring haunting melodies and introspective lyrics that explore the complexities of city life after dark.',
    release_date: '2024-03-15',
    release_type: 'album',
    catalog_number: 'ADER001',
    label_id: 1,
    cover_image_url: '/images/nd-releases/midnight-chronicles.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/midnight-chronicles',
    duration_seconds: 2847,
    track_count: 12,
    is_featured: true,
    display_order: 1,
    status: 'published',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-15T15:30:00Z',
    label: {
      id: 1,
      name: 'All Day Every Day Records',
      slug: 'all-day-every-day-records',
      description: 'Premier underground hip-hop label',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    artists: [
      {
        id: 1,
        name: 'MC Shadow',
        slug: 'mc-shadow',
        bio: 'Underground hip-hop artist known for introspective lyrics and dark atmospheric style.',
        role: 'primary',
        display_order: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'DJ Eclipse',
        slug: 'dj-eclipse',
        bio: 'Producer and DJ specializing in atmospheric beats and cinematic soundscapes.',
        role: 'producer',
        display_order: 2,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    streaming_links: [
      {
        id: 1,
        release_id: 1,
        platform: 'spotify',
        url: 'https://open.spotify.com/album/midnight-chronicles',
        is_active: true,
        created_at: '2024-03-15T15:30:00Z',
        updated_at: '2024-03-15T15:30:00Z'
      },
      {
        id: 2,
        release_id: 1,
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        is_active: true,
        created_at: '2024-03-15T15:30:00Z',
        updated_at: '2024-03-15T15:30:00Z'
      },
      {
        id: 3,
        release_id: 1,
        platform: 'apple_music',
        url: 'https://music.apple.com/us/album/midnight-chronicles',
        is_active: true,
        created_at: '2024-03-15T15:30:00Z',
        updated_at: '2024-03-15T15:30:00Z'
      }
    ]
  },
  {
    id: 2,
    title: 'Street Symphony',
    slug: 'street-symphony',
    description: 'Raw beats and authentic storytelling from the streets. This EP captures the essence of urban life with unfiltered honesty and powerful wordplay.',
    release_date: '2024-02-28',
    release_type: 'ep',
    catalog_number: 'ADER002',
    label_id: 1,
    cover_image_url: '/images/nd-releases/street-symphony.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/street-symphony',
    duration_seconds: 1456,
    track_count: 6,
    is_featured: true,
    display_order: 2,
    status: 'published',
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-02-28T12:15:00Z',
    label: {
      id: 1,
      name: 'All Day Every Day Records',
      slug: 'all-day-every-day-records',
      description: 'Premier underground hip-hop label',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    artists: [
      {
        id: 3,
        name: 'Lyrical Genius',
        slug: 'lyrical-genius',
        bio: 'Master wordsmith with a gift for storytelling and complex rhyme schemes.',
        role: 'primary',
        display_order: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 4,
        name: 'Beat Master B',
        slug: 'beat-master-b',
        bio: 'Producer known for hard-hitting drums and street-inspired soundscapes.',
        role: 'producer',
        display_order: 2,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    streaming_links: [
      {
        id: 4,
        release_id: 2,
        platform: 'spotify',
        url: 'https://open.spotify.com/album/street-symphony',
        is_active: true,
        created_at: '2024-02-28T12:15:00Z',
        updated_at: '2024-02-28T12:15:00Z'
      },
      {
        id: 5,
        release_id: 2,
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=street-symphony-video',
        is_active: true,
        created_at: '2024-02-28T12:15:00Z',
        updated_at: '2024-02-28T12:15:00Z'
      }
    ]
  },
  {
    id: 3,
    title: 'Underground Anthems',
    slug: 'underground-anthems',
    description: 'Classic hip-hop vibes with modern production. A celebration of the underground scene that birthed the culture.',
    release_date: '2024-01-20',
    release_type: 'single',
    catalog_number: 'ADER003',
    label_id: 1,
    cover_image_url: '/images/nd-releases/underground-anthems.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/track/underground-anthems',
    duration_seconds: 234,
    track_count: 1,
    is_featured: true,
    display_order: 3,
    status: 'published',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-20T16:45:00Z',
    label: {
      id: 1,
      name: 'All Day Every Day Records',
      slug: 'all-day-every-day-records',
      description: 'Premier underground hip-hop label',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    artists: [
      {
        id: 5,
        name: 'Urban Prophet',
        slug: 'urban-prophet',
        bio: 'Veteran MC with deep roots in the underground hip-hop scene.',
        role: 'primary',
        display_order: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 6,
        name: 'Classic Cuts',
        slug: 'classic-cuts',
        bio: 'Legendary DJ and turntablist known for innovative scratching techniques.',
        role: 'collaborator',
        display_order: 2,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    streaming_links: [
      {
        id: 6,
        release_id: 3,
        platform: 'spotify',
        url: 'https://open.spotify.com/track/underground-anthems',
        is_active: true,
        created_at: '2024-01-20T16:45:00Z',
        updated_at: '2024-01-20T16:45:00Z'
      },
      {
        id: 7,
        release_id: 3,
        platform: 'apple_music',
        url: 'https://music.apple.com/us/song/underground-anthems',
        is_active: true,
        created_at: '2024-01-20T16:45:00Z',
        updated_at: '2024-01-20T16:45:00Z'
      },
      {
        id: 8,
        release_id: 3,
        platform: 'bandcamp',
        url: 'https://alldayeverydayrecords.bandcamp.com/track/underground-anthems',
        is_active: true,
        created_at: '2024-01-20T16:45:00Z',
        updated_at: '2024-01-20T16:45:00Z'
      }
    ]
  },
  {
    id: 4,
    title: 'Concrete Dreams',
    slug: 'concrete-dreams',
    description: 'Introspective lyrics over jazz-influenced beats that explore themes of urban living and personal growth.',
    release_date: '2024-04-10',
    release_type: 'album',
    catalog_number: 'ADER004',
    cover_image_url: '/images/nd-releases/concrete-dreams.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/concrete-dreams',
    duration_seconds: 3156,
    track_count: 14,
    is_featured: true,
    display_order: 4,
    status: 'published',
    created_at: '2024-02-01T11:00:00Z',
    updated_at: '2024-04-10T14:20:00Z',
    label: {
      id: 2,
      name: 'Nickel & Dime Records',
      slug: 'nickel-and-dime-records',
      description: 'Independent label focusing on experimental hip-hop',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    artists: [
      {
        id: 7,
        name: 'Smooth Operator',
        slug: 'smooth-operator',
        bio: 'Jazz-influenced rapper known for sophisticated wordplay and introspective themes.',
        role: 'primary',
        display_order: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 8,
        name: 'Jazz Hands',
        slug: 'jazz-hands',
        bio: 'Multi-instrumentalist producer specializing in live jazz-hop fusion.',
        role: 'producer',
        display_order: 2,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    streaming_links: [
      {
        id: 10,
        release_id: 4,
        platform: 'bandcamp',
        url: 'https://alldayeverydayrecords.bandcamp.com/album/concrete-dreams',
        is_active: true,
        created_at: '2024-04-10T14:20:00Z',
        updated_at: '2024-04-10T14:20:00Z'
      },
      {
        id: 11,
        release_id: 4,
        platform: 'spotify',
        url: 'https://open.spotify.com/album/concrete-dreams',
        is_active: true,
        created_at: '2024-04-10T14:20:00Z',
        updated_at: '2024-04-10T14:20:00Z'
      }
    ]
  },
  {
    id: 5,
    title: 'City Lights',
    slug: 'city-lights',
    description: 'Night-time vibes and urban exploration',
    release_date: '2024-05-15',
    release_type: 'ep',
    catalog_number: 'ADER005',
    cover_image_url: '/images/nd-releases/city-lights.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/city-lights',
    duration_seconds: 1823,
    track_count: 7,
    is_featured: true,
    display_order: 5,
    status: 'published',
    created_at: '2024-03-01T13:00:00Z',
    updated_at: '2024-05-15T10:30:00Z',
    label: {
      id: 3,
      name: 'Triple X Records',
      slug: 'triple-x-records',
      description: 'Cutting-edge urban music label',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    artists: [
      {
        id: 9,
        name: 'Night Walker',
        slug: 'night-walker',
        bio: 'Atmospheric rapper who finds inspiration in the quiet moments of city nights.',
        role: 'primary',
        display_order: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 10,
        name: 'Neon Beats',
        slug: 'neon-beats',
        bio: 'Electronic music producer with a passion for cinematic soundscapes.',
        role: 'producer',
        display_order: 2,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    streaming_links: [
      {
        id: 12,
        release_id: 5,
        platform: 'bandcamp',
        url: 'https://alldayeverydayrecords.bandcamp.com/album/city-lights',
        is_active: true,
        created_at: '2024-05-15T10:30:00Z',
        updated_at: '2024-05-15T10:30:00Z'
      },
      {
        id: 13,
        release_id: 5,
        platform: 'apple_music',
        url: 'https://music.apple.com/album/city-lights',
        is_active: true,
        created_at: '2024-05-15T10:30:00Z',
        updated_at: '2024-05-15T10:30:00Z'
      },
      {
        id: 14,
        release_id: 5,
        platform: 'youtube_music',
        url: 'https://music.youtube.com/playlist?list=city-lights',
        is_active: true,
        created_at: '2024-05-15T10:30:00Z',
        updated_at: '2024-05-15T10:30:00Z'
      }
    ]
  },
  {
    id: 6,
    title: 'Raw Energy',
    slug: 'raw-energy',
    description: 'High-energy tracks for the club scene',
    release_date: '2024-06-01',
    release_type: 'mixtape',
    catalog_number: 'ADER006',
    cover_image_url: '/images/nd-releases/raw-energy.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/raw-energy',
    duration_seconds: 2234,
    track_count: 10,
    is_featured: true,
    display_order: 6,
    status: 'published',
    created_at: '2024-04-01T16:00:00Z',
    updated_at: '2024-06-01T18:00:00Z',
    label: {
      id: 1,
      name: 'All Day Every Day Records',
      slug: 'all-day-every-day-records',
      description: 'Independent hip-hop label showcasing diverse urban talent',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    artists: [
      {
        id: 11,
        name: 'Energy MC',
        slug: 'energy-mc',
        bio: 'High-octane rapper bringing raw power and infectious energy to every track.',
        role: 'primary',
        display_order: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 12,
        name: 'Pump It Up',
        slug: 'pump-it-up',
        bio: 'Club-focused producer known for creating irresistible dancefloor anthems.',
        role: 'producer',
        display_order: 2,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    streaming_links: [
      {
        id: 15,
        release_id: 6,
        platform: 'bandcamp',
        url: 'https://alldayeverydayrecords.bandcamp.com/album/raw-energy',
        is_active: true,
        created_at: '2024-06-01T18:00:00Z',
        updated_at: '2024-06-01T18:00:00Z'
      },
      {
        id: 16,
        release_id: 6,
        platform: 'spotify',
        url: 'https://open.spotify.com/album/raw-energy',
        is_active: true,
        created_at: '2024-06-01T18:00:00Z',
        updated_at: '2024-06-01T18:00:00Z'
      },
      {
        id: 17,
        release_id: 6,
        platform: 'apple_music',
        url: 'https://music.apple.com/album/raw-energy',
        is_active: true,
        created_at: '2024-06-01T18:00:00Z',
        updated_at: '2024-06-01T18:00:00Z'
      },
      {
        id: 18,
        release_id: 6,
        platform: 'youtube_music',
        url: 'https://music.youtube.com/playlist?list=raw-energy',
        is_active: true,
        created_at: '2024-06-01T18:00:00Z',
        updated_at: '2024-06-01T18:00:00Z'
      }
    ]
  },
  {
    id: 7,
    title: 'Reflections',
    slug: 'reflections',
    description: 'Contemplative rhymes over ambient soundscapes',
    release_date: '2024-07-20',
    release_type: 'single',
    catalog_number: 'ADER007',
    cover_image_url: '/images/nd-releases/reflections.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/track/reflections',
    duration_seconds: 287,
    track_count: 1,
    is_featured: true,
    display_order: 7,
    status: 'published',
    created_at: '2024-06-01T12:00:00Z',
    updated_at: '2024-07-20T14:15:00Z',
    label: {
      id: 4,
      name: 'Ransom Note Records',
      slug: 'ransom-note-records',
      description: 'Experimental and alternative hip-hop releases',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    artists: [
      {
        id: 13,
        name: 'Deep Thinker',
        slug: 'deep-thinker',
        bio: 'Introspective artist exploring consciousness and personal growth through music.',
        role: 'primary',
        display_order: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 14,
        name: 'Ambient Soul',
        slug: 'ambient-soul',
        bio: 'Atmospheric producer creating immersive sonic landscapes for contemplative music.',
        role: 'producer',
        display_order: 2,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    streaming_links: [
      {
        id: 19,
        release_id: 7,
        platform: 'bandcamp',
        url: 'https://alldayeverydayrecords.bandcamp.com/track/reflections',
        is_active: true,
        created_at: '2024-07-20T14:15:00Z',
        updated_at: '2024-07-20T14:15:00Z'
      },
      {
        id: 20,
        release_id: 7,
        platform: 'spotify',
        url: 'https://open.spotify.com/track/reflections',
        is_active: true,
        created_at: '2024-07-20T14:15:00Z',
        updated_at: '2024-07-20T14:15:00Z'
      }
    ]
  },
  {
    id: 8,
    title: 'Block Party',
    slug: 'block-party',
    description: 'Community celebration with old-school flavor',
    release_date: '2024-08-05',
    release_type: 'compilation',
    catalog_number: 'ADER008',
    cover_image_url: '/images/nd-releases/block-party.jpg',
    bandcamp_url: 'https://alldayeverydayrecords.bandcamp.com/album/block-party',
    duration_seconds: 4567,
    track_count: 20,
    is_featured: true,
    display_order: 8,
    status: 'published',
    created_at: '2024-05-01T10:00:00Z',
    updated_at: '2024-08-05T20:30:00Z',
    label: {
      id: 1,
      name: 'All Day Every Day Records',
      slug: 'all-day-every-day-records',
      description: 'Independent hip-hop label showcasing diverse urban talent',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    artists: [
      {
        id: 15,
        name: 'Various Artists',
        slug: 'various-artists',
        bio: 'Community collective featuring multiple artists from the All Day Every Day Records roster.',
        role: 'primary',
        display_order: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    streaming_links: [
      {
        id: 21,
        release_id: 8,
        platform: 'bandcamp',
        url: 'https://alldayeverydayrecords.bandcamp.com/album/block-party',
        is_active: true,
        created_at: '2024-08-05T20:30:00Z',
        updated_at: '2024-08-05T20:30:00Z'
      },
      {
        id: 22,
        release_id: 8,
        platform: 'spotify',
        url: 'https://open.spotify.com/album/block-party',
        is_active: true,
        created_at: '2024-08-05T20:30:00Z',
        updated_at: '2024-08-05T20:30:00Z'
      },
      {
        id: 23,
        release_id: 8,
        platform: 'apple_music',
        url: 'https://music.apple.com/album/block-party',
        is_active: true,
        created_at: '2024-08-05T20:30:00Z',
        updated_at: '2024-08-05T20:30:00Z'
      },
      {
        id: 24,
        release_id: 8,
        platform: 'youtube_music',
        url: 'https://music.youtube.com/playlist?list=block-party',
        is_active: true,
        created_at: '2024-08-05T20:30:00Z',
        updated_at: '2024-08-05T20:30:00Z'
      }
    ]
  }
];

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
   * Falls back to static seed data when backend is not available
   */
  async getReleases(params?: GetReleasesParams): Promise<ReleaseOverview[]> {
    // In development mode, use seed data directly if no backend is running
    const isDev = import.meta.env.MODE === 'development';
    
    if (isDev) {
      console.log('Development mode: Using seed data for releases');
      return this.getFilteredSeedData(params);
    }
    
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
      
      // The PHP endpoint returns an array directly, not wrapped in ApiResponse
      const releases = await this.apiService.get<ReleaseOverview[]>(url);
      
      // Ensure we always return an array
      return Array.isArray(releases) ? releases : [];
      
    } catch (error) {
      console.warn('API not available, using seed data:', error);
      // Return filtered seed data on error to prevent UI crashes
      return this.getFilteredSeedData(params);
    }
  }

  /**
   * Filter and sort seed data based on parameters
   */
  private getFilteredSeedData(params?: GetReleasesParams): ReleaseOverview[] {
    let releases = [...SEED_RELEASES];

    // Apply filters
    if (params?.featured !== undefined) {
      releases = releases.filter(r => r.is_featured === params.featured);
    }
    
    if (params?.status) {
      releases = releases.filter(r => r.status === params.status);
    }
    
    if (params?.release_type) {
      releases = releases.filter(r => r.release_type === params.release_type);
    }

    // Artist filtering: check if any artist in the detailed data matches
    if (params?.artist_id) {
      const artistReleaseIds = new Set(
        SEED_RELEASE_DETAILS
          .filter(release => release.artists.some(artist => artist.id === params.artist_id))
          .map(release => release.id)
      );
      releases = releases.filter(r => artistReleaseIds.has(r.id));
    }

    // Search filtering: search in title and artist names
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      releases = releases.filter(r => 
        r.title.toLowerCase().includes(searchTerm) ||
        r.artists_with_roles?.toLowerCase().includes(searchTerm) ||
        r.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Label filtering
    if (params?.label_id) {
      // For seed data, we'll use label names since we don't have complex label relationships
      releases = releases.filter(r => {
        // Map label IDs to names for seed data
        const labelMapping: Record<number, string> = {
          1: 'All Day Every Day Records',
          2: 'Nickel & Dime Records'
        };
        return r.label_name === labelMapping[params.label_id!];
      });
    }

    // Apply sorting
    if (params?.sort) {
      releases.sort((a, b) => {
        const aValue = a[params.sort as keyof ReleaseOverview] ?? 0;
        const bValue = b[params.sort as keyof ReleaseOverview] ?? 0;
        
        if (params.sort === 'release_date') {
          const aDate = new Date(a.release_date || '').getTime();
          const bDate = new Date(b.release_date || '').getTime();
          const comparison = aDate - bDate;
          return params.order === 'desc' ? -comparison : comparison;
        }
        
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return params.order === 'desc' ? -comparison : comparison;
      });
    }

    // Apply limit
    if (params?.limit) {
      releases = releases.slice(0, params.limit);
    }

    return releases;
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
   * Get featured releases optimized for carousel display
   * Returns carousel-specific data structure with only needed fields
   * Maps to: GET /get-releases.php?featured=true
   */
  async getFeaturedReleasesForCarousel(limit = 8): Promise<ReleaseCarouselSlide[]> {
    try {
      const releases = await this.getFeaturedReleases(limit);
      
      // Map to carousel-specific interface for type safety
      return releases.map(release => ({
        id: release.id,
        title: release.title,
        slug: release.slug,
        cover_image_url: release.cover_image_url,
        release_date: release.release_date,
        release_type: release.release_type,
        label_name: release.label_name,
        artists_with_roles: release.artists_with_roles,
        bandcamp_url: release.bandcamp_url
      }));
      
    } catch (error) {
      console.error('Error fetching featured releases for carousel:', error);
      return [];
    }
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
    // In development mode, use seed data directly
    const isDev = import.meta.env.MODE === 'development';
    
    if (isDev) {
      console.log(`Development mode: Looking up release by slug '${slug}' in seed data`);
      const seedRelease = SEED_RELEASE_DETAILS.find(r => r.slug === slug);
      if (seedRelease) {
        console.log(`Found seed data for '${slug}':`, seedRelease.title);
        return seedRelease;
      }
      console.log(`No seed data found for slug '${slug}'`);
      return null;
    }
    
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
      
      // Fall back to seed data when API is not available
      const seedRelease = SEED_RELEASE_DETAILS.find(r => r.slug === slug);
      return seedRelease || null;
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