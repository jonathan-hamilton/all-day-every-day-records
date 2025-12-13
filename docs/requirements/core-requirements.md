# Core Requirements for All Day Every Day Records

## Functional Requirements

### User Interface & Navigation

- REQ-UI-1: System shall provide a responsive navigation bar that adapts to desktop and mobile devices with hamburger menu for mobile
- REQ-UI-2: System shall display a home page featuring a carousel with 8 slides for featured releases
- REQ-UI-3: System shall provide a releases page with grid layout for all current releases
- REQ-UI-4: System shall include an about page (stub implementation initially)
- REQ-UI-5: System shall provide detailed release pages with embedded video content support
- REQ-UI-6: System shall include a contact page accessible via footer link
- REQ-UI-7: System shall provide a Videos page in navigation bar positioned after Releases
- REQ-UI-8: System shall provide a Discography page in navigation bar positioned after Videos
- REQ-UI-9: System shall display navigation items in order: Home, Releases, Videos, Discography, About, Contact
- REQ-UI-10: System shall include homepage search functionality above carousel for finding releases
- REQ-UI-11: System shall display search component at 35% reduced size compared to standard input fields
- REQ-UI-12: System shall use record icon for all three homepage section headings (New Releases, Featured Releases, Recent Releases)
- REQ-UI-13: System shall implement drag-enabled carousel or auto-rotating carousel without navigation arrows
- REQ-UI-14: System shall display artist name before release title across all pages and components
- REQ-UI-15: System shall provide alphabetical navigation (A-Z) on releases page and videos page for quick artist access

### Release Management

- REQ-RM-1: System shall store release data including title, artist, label, format, release date, cover image, and description
- REQ-RM-2: System shall support streaming service links (Spotify, YouTube, Apple Music, Amazon Music)
- REQ-RM-3: System shall categorize releases with tags (featured, new, removed)
- REQ-RM-4: System shall provide filtering capabilities on releases page by artist and title with real-time search
- REQ-RM-4.1: System shall implement server-side pagination for releases with configurable page size (default 20 items)
- REQ-RM-4.2: System shall support individual filtering by artist name with partial text matching
- REQ-RM-4.3: System shall support individual filtering by release title with partial text matching
- REQ-RM-4.4: System shall provide combined search functionality across both artist and title fields
- REQ-RM-4.5: System shall display pagination controls with current page, total pages, and navigation
- REQ-RM-4.6: System shall return pagination metadata including total count and page information
- REQ-RM-5: System shall display release count and filtering status to users
- REQ-RM-6: System shall support embedded YouTube video content on detail pages
- REQ-RM-7: System shall display related releases by the same artist on detail pages
- REQ-RM-8: System shall categorize releases as current releases or discography (historical releases no longer under contract)
- REQ-RM-9: System shall allow releases to appear in both Releases and Discography sections via checkbox selection
- REQ-RM-10: System shall sort releases alphabetically by artist name, then by title for artists with multiple releases
- REQ-RM-11: System shall match artwork and text size to nickel-and-dime site design patterns
- REQ-RM-12: System shall display streaming videos in 2-column layout on detail pages (stacked on narrow viewports)
- REQ-RM-13: System shall support audio player widget on release detail pages, configurable via admin
- REQ-RM-14: System shall support social media links (Instagram, Facebook, TikTok, X) on release detail pages, configurable via admin

### Content Display

- REQ-CD-1: System shall display a 2x2 grid of embedded YouTube videos on homepage (stacked for mobile)
- REQ-CD-2: System shall maintain consistent release item layout matching nickel-and-dime design patterns
- REQ-CD-3: System shall support cover image display for all releases
- REQ-CD-4: System shall provide clear visual hierarchy and rap-themed styling similar to shadyrecords.com
- REQ-CD-5: System shall display homepage section labeled "New Releases" (formerly Featured Releases) with album graphic icon
- REQ-CD-6: System shall display homepage section labeled "Featured Releases" (formerly Recent Releases) with record icon
- REQ-CD-7: System shall display homepage search results as clickable list navigating to ReleaseDetail pages
- REQ-CD-8: System shall set background logo opacity to 25% more transparent than current implementation
- REQ-CD-9: System shall reduce copyright text size by 25% on homepage footer
- REQ-CD-10: System shall include PO Box address on contact page: "PO Box 412385, Los Angeles, CA 90041"

### Administrative Features

- REQ-AD-1: System shall provide admin authentication for content management
- REQ-AD-2: System shall support CRUD operations for releases (create, read, update, delete)
- REQ-AD-3: System shall allow image upload functionality for release covers
- REQ-AD-4: System shall provide admin-only view of removed releases
- REQ-AD-5: System shall support password change functionality for admin users
- REQ-AD-6: System shall provide CRUD operations for videos with separate database table and API endpoints
- REQ-AD-7: System shall provide admin UI for managing video content independently from releases
- REQ-AD-8: System shall provide dropdown/checkbox controls for categorizing releases as Releases, Discography, or both
- REQ-AD-9: System shall provide admin configuration for audio player widget on release detail pages
- REQ-AD-10: System shall provide admin configuration for social media links on release detail pages

## Non-Functional Requirements

### Performance

- REQ-NFR-1: System shall load initial page content within 3 seconds on standard broadband connections
- REQ-NFR-2: System shall support concurrent access by up to 1000 users without performance degradation
- REQ-NFR-3: System shall optimize image loading with appropriate compression and lazy loading

### Technology Stack

- REQ-NFR-4: Frontend shall be built using React with TypeScript for type safety
- REQ-NFR-5: Backend API shall be implemented in PHP for data management
- REQ-NFR-6: System shall use Vite for build tooling and development server
- REQ-NFR-7: System shall implement Material-UI components for consistent design system
- REQ-NFR-8: System shall use MySQL/MariaDB for data persistence

### Development Environment

- REQ-DEV-1: System shall support hybrid development mode where frontend runs locally while API calls target production backend
- REQ-DEV-2: System shall provide environment configuration for three deployment modes: full-local, hybrid-dev, and production
- REQ-DEV-3: Production backend shall implement CORS configuration to allow localhost origins during hybrid development
- REQ-DEV-4: System shall provide clear environment variable configuration for switching between local and production API endpoints
- REQ-DEV-5: Development setup shall support hot module replacement for rapid frontend iteration while maintaining production backend connectivity

### Security

- REQ-NFR-9: System shall implement secure authentication for admin functions
- REQ-NFR-10: System shall use CORS protection for API endpoints
- REQ-NFR-11: System shall validate and sanitize all user inputs
- REQ-NFR-12: System shall protect against common web vulnerabilities (XSS, SQL injection)

### Scalability & Maintenance

- REQ-NFR-13: System shall use responsive design principles for mobile-first development
- REQ-NFR-14: System shall implement modular component architecture for maintainability
- REQ-NFR-15: System shall implement proper error handling and logging mechanisms

### Domain & Hosting

- REQ-NFR-15: System shall be accessible via www.alldayeverydayrecords.com domain
- REQ-NFR-16: System shall support SSL/HTTPS encryption for all traffic
- REQ-NFR-17: System shall implement SEO-friendly URLs and meta tags

---

*Generated on November 9, 2025 based on project vision and architecture analysis*