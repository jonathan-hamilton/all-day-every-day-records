# Sprint 8 User Stories
**Status**: PENDING ⏸️  
**Duration**: 2 weeks  
**Focus**: Advanced Features & Production Deployment  
**Started**: TBD

---

## Sprint Overview
Sprint 8 completes the All Day Every Day Records platform with advanced UI enhancements, multimedia integration, security hardening, and production deployment. This final sprint focuses on enriching the user experience with auto-rotating carousel, audio player widgets, social media integration, ensuring backend security, and delivering production-ready performance with optimization and deployment.

## Sprint Goals
1. Enhance homepage carousel with auto-rotation and improved UX
2. Integrate audio player widgets on release detail pages with admin controls
3. Add social media links to release detail pages with admin management
4. Correct homepage section labels (swap Featured/Recent labels)
5. Conduct comprehensive backend security audit and apply hardening measures
6. Optimize performance and deploy to production with SSL and SEO

---

## Progress Tracker

| Story ID | Title | Status | Dependencies |
|----------|-------|--------|--------------|
| S8.1 | Auto-Rotating Homepage Carousel | COMPLETE ✅ | None |
| S8.2 | Audio Player Widget Integration (consolidated with S8.7) | COMPLETE ✅ | None |
| S8.3 | Social Media Links on Release Details | COMPLETE ✅ | None |
| S8.4 | Homepage Section Label Corrections | COMPLETE ✅ | None |
| S8.5 | Performance Optimization & Production Deployment | PENDING ⏸️ | S8.1, S8.2, S8.3, S8.4, S8.6, S8.7 |
| S8.6 | Backend Security Analysis & Hardening | IN PROGRESS ⚙️ | None |
| S8.7 | 30-Second Audio Preview System (consolidated into S8.2) | COMPLETE ✅ | None |

**Sprint 8 Progress: 5/7 stories (71% COMPLETE)**

---

## User Stories

### S8.1: Auto-Rotating Homepage Carousel
**Priority**: HIGH  
**Status**: COMPLETE ✅  
**Estimate**: 6-8 hours  
**Completion Date**: December 14, 2025

**User Story**:  
As a visitor to the homepage, I want the featured releases carousel to auto-rotate so that I can discover content without manual interaction.

**Acceptance Criteria**:
✅ Carousel automatically advances to next slide every 5 seconds
✅ Auto-rotation pauses when user hovers over carousel
✅ Auto-rotation resumes when hover ends
✅ Manual navigation (drag/swipe) temporarily pauses auto-rotation with 10-second auto-resume
✅ Smooth transitions between slides with fade or slide animation
✅ Navigation dots indicate current slide and total slides
✅ Carousel loops infinitely (returns to first slide after last)
✅ Responsive behavior maintained across mobile, tablet, desktop
✅ Accessibility: keyboard navigation support (arrow keys)
✅ Mouse drag (desktop) and touch swipe (mobile) implemented
✅ Navigation arrows removed per design requirements

**Implementation Summary**:
- Enhanced existing ReleaseCarousel component with auto-rotation logic
- Implemented mouse drag for desktop and touch swipe for mobile
- Added intelligent pause/resume system with 10-second timeout after manual interaction
- Removed navigation arrows while maintaining keyboard accessibility
- Fixed UI bugs: ghost image on drag, cursor styling issues
- Updated TypeScript types in releaseService and Release types
- Improved admin dashboard: consolidated CREATE/UPDATE button logic, fixed cover image message

**Technical Notes**:
- Used React hooks (useState, useEffect, useCallback) for state management
- Auto-rotation controlled by setInterval with proper cleanup
- Drag detection with threshold (50px minimum swipe distance)
- Cursor styling with CSS override for nested clickable elements
- Type safety improvements in ReleaseOverview interface
- **Infinite Scrolling Enhancement** (December 15, 2025):
  - Implemented seamless infinite loop by duplicating release items in render array
  - Carousel shows 3 items at a time (1 mobile, 2 tablet, 3 desktop) with no blank spaces
  - Navigation wraps at totalSlides boundary for smooth continuous scrolling
  - Restored visual spacing between items (gap: 2, ~16px) for improved readability
  - Ensures all 8 featured releases are accessible with proper wrapping behavior

**Files Modified**:
- `frontend/src/components/ReleaseCarousel.tsx` - Complete carousel enhancement
- `frontend/src/services/releaseService.ts` - Type fixes and field mapping
- `frontend/src/types/Release.ts` - Added streaming URL fields to ReleaseOverview
- `frontend/src/pages/AdminDashboard.tsx` - Button consolidation and UI improvements

**Dependencies**: None (enhances existing Sprint 2 carousel)

**Developer Notes**:
- Current carousel: Material-UI based from Sprint 2
- Consider `react-slick` or native Material-UI autoplay features
- Use `setInterval` with cleanup in `useEffect` for auto-rotation
- Pause logic: track hover state and user interaction
- Transition timing: 500ms slide transition, 5000ms auto-advance interval
- File to modify: `frontend/src/components/ReleaseCarousel.tsx`
- Maintain existing responsive grid layout and styling
- Ensure performance with large image assets (lazy loading)

---

### S8.2: Audio Player Widget Integration
**Priority**: HIGH  
**Status**: COMPLETE ✅  
**Estimate**: 8-10 hours  
**Completion Date**: December 20, 2025  
**Consolidated**: This story was implemented with S8.7 (30-Second Audio Preview System) as a single unified feature

**User Story**:  
As a visitor viewing a release detail page, I want to listen to audio samples or full tracks so that I can preview the music before purchasing or streaming.

**Acceptance Criteria** (Consolidated S8.2 + S8.7):
✅ Audio player displays minimal speaker icon on release detail pages when audio exists
✅ Icon positioned inline with release title for clean integration
✅ Click icon to play/pause MP3 audio preview
✅ Pulsing animation during playback for visual feedback
✅ Audio loops continuously (no time limit - user preference)
✅ Admin can upload MP3 files via release edit form
✅ File upload validates: MP3 format, 2MB max size, 35 seconds max duration
✅ Client-side duration validation using HTML5 Audio API
✅ Server-side validation: MIME type (audio/mpeg), file extension (.mp3), size
✅ Environment-aware file storage (dev: /var/www/html/uploads/audio/, prod: /release-audio/)
✅ Database stores audio_url in releases table
✅ Old audio files automatically deleted when uploading replacement
✅ Admin can delete audio via "Remove Audio" button
✅ Responsive controls work on mobile and desktop
✅ No progress bar or time display (minimal UI)

**Implementation Summary**:
- Created database migration `009_add_audio_url.sql` with VARCHAR(500) column and index
- Implemented `backend/api/upload-audio.php` with full validation (requireAuth, MIME type, extension, size)
- Updated backend APIs: `upsert-release.php`, `get-releases.php`, `get-releases-by-id.php` to handle audio_url
- Created minimal `AudioPlayer.tsx` component (IconButton with speaker icon, pulsing CSS animation, loop support)
- Integrated audio upload in `AdminDashboard.tsx` with client-side validation (file extension, size, duration check)
- Positioned AudioPlayer inline with release title on `ReleaseDetailPage.tsx` using flexbox
- File storage pattern: `{release_id}_audio.mp3` with environment-aware paths
- Consolidated S8.7 (30-second preview) into single implementation with user-controlled looping

**Technical Notes**:
- Used HTML5 Audio API for client-side duration validation before upload
- Environment detection uses getConfig() for dev vs production paths
- AudioPlayer uses React hooks (useState, useEffect, useRef) for state management
- Pulsing animation implemented with CSS keyframes
- Flexbox layout (display: flex, alignItems: center, gap: 2) for title/icon positioning
- Material-UI components: IconButton, Tooltip, Grid, VolumeUpIcon

**Files Modified**:
- `backend/database/migrations/009_add_audio_url.sql` (NEW)
- `backend/api/upload-audio.php` (NEW)
- `backend/api/upsert-release.php` (MODIFIED)
- `backend/api/get-releases.php` (MODIFIED)
- `frontend/src/components/AudioPlayer.tsx` (NEW)
- `frontend/src/pages/AdminDashboard.tsx` (MODIFIED)
- `frontend/src/pages/ReleaseDetailPage.tsx` (MODIFIED)
- `frontend/src/types/Release.ts` (MODIFIED)

**Dependencies**: None (extends Sprint 3 release detail pages and admin CRUD)

---

### S8.3: Social Media Links on Release Details
**Priority**: MEDIUM  
**Status**: COMPLETE ✅  
**Estimate**: 6-8 hours  
**Completion Date**: December 14, 2025

**User Story**:  
As a visitor viewing a release detail page, I want to access social media links related to the release so that I can follow the artist on various platforms.

**Acceptance Criteria**:
✅ Social media icons displayed on release detail pages (Instagram, Facebook, TikTok, Twitter/X)
✅ Clicking icon opens social media page in new tab
✅ Custom PNG icons used for brand consistency
✅ Admin can configure social media URLs per release in admin dashboard
✅ Social media URL fields added to release edit form in organized section
✅ Icons only display for configured platforms (conditional rendering)
✅ Responsive icon layout with proper spacing (40px mobile, 48px desktop)
✅ Icon hover effects with scale and brightness transitions
✅ All fields optional (no breaking changes)

**Implementation Summary**:
- Created database migration 007_add_social_media_urls.sql adding 4 VARCHAR(500) columns with indexes
- Updated backend upsert-release.php to handle social media fields in UPDATE and INSERT queries
- Updated backend get-releases.php to return social media URLs in admin and public API responses
- Created SocialMediaLinks.tsx component (103 lines) with conditional rendering and custom PNG icons
- Integrated component on ReleaseDetailPage below streaming links
- Added "Social Media Links" section in AdminDashboard with 4 TextField components in 2-column layout
- Updated TypeScript Release interface with optional social media URL fields
- All fields optional using ?? null operator pattern

**Technical Notes**:
- Custom PNG icons from /images/ folder instead of Material-UI for brand authenticity
- Component uses props-based architecture (no Zustand needed for display-only)
- Security: Links use target="_blank" with rel="noopener noreferrer"
- Positioned between Audio and Video streaming sections for logical flow
- Hover effects: transform scale(1.1) + filter brightness(1.2)
- Accessibility: ARIA labels, tooltips, keyboard navigation support

**Design Pattern Compliance**: ✅ VALIDATED
- Backend: Parameterized queries, optional fields pattern, SQL injection protection
- Frontend: Component pattern, props-based state, TypeScript type safety, conditional rendering
- Security: rel="noopener noreferrer", proper input handling
- Accessibility: ARIA labels, tooltips, semantic HTML

**Files Modified**:
- `backend/database/migrations/007_add_social_media_urls.sql` (CREATED)
- `backend/api/upsert-release.php` (MODIFIED - 4 fields in UPDATE/INSERT)
- `backend/api/get-releases.php` (MODIFIED - 4 fields in admin/public queries)
- `frontend/src/components/SocialMediaLinks.tsx` (CREATED - 103 lines)
- `frontend/src/pages/AdminDashboard.tsx` (MODIFIED - added form section)
- `frontend/src/pages/ReleaseDetailPage.tsx` (MODIFIED - integrated component)
- `frontend/src/types/Release.ts` (MODIFIED - added optional fields)

**Dependencies**: None (extends Sprint 3 admin CRUD and release detail pages)

---

### S8.4: Homepage Section Label Corrections
**Priority**: LOW  
**Status**: COMPLETE ✅  
**Estimate**: 1-2 hours  
**Completion Date**: December 14, 2025

**User Story**:  
As a product owner, I want the homepage section labels to correctly reflect their content so that visitors understand what they're viewing.

**Acceptance Criteria**:
✅ "Featured Releases" label changed to "New Releases" (top section with grid)
✅ "Recent Releases" label changed to "Featured Releases" (bottom section with carousel)
✅ Section icons remain consistent (record icon for both sections)
✅ Label typography and styling unchanged
✅ Responsive behavior maintained across all breakpoints
✅ Changes apply to homepage only (no other page affected)

**Implementation Summary**:
- Updated top section label from "Featured Releases" to "New Releases"
- Changed top section tag filter from `tag === 'Featured'` to `tag === 'New'`
- Updated bottom section label from "Recent Releases" to "Featured Releases"
- Changed bottom section carousel tag prop from `tag="Recent"` to `tag="Featured"`
- Updated code comments to reflect new section names

**Technical Notes**:
- Simple text and tag value changes only
- No component structure modifications
- Labels now correctly match the content being displayed based on tag filters

**Design Pattern Compliance**: ✅ VALIDATED
- No pattern changes - maintains existing component architecture
- Factory pattern still used for services
- Props-based rendering preserved

**Files Modified**:
- `frontend/src/pages/Home.tsx` - 4 line changes (2 labels, 2 tag values, updated comments)

**Dependencies**: None (simple label text change)

---

### S8.5: Performance Optimization & Production Deployment
**Priority**: HIGH  
**Status**: PENDING ⏸️  
**Estimate**: 12-16 hours

**User Story**:  
As a product owner, I want the platform optimized and deployed to production so that users can access a fast, secure, and reliable website.

**Acceptance Criteria**:
- Page load times under 3 seconds on standard broadband connection
- Image optimization with lazy loading implemented across all pages
- Code splitting and bundle optimization with Vite
- Performance testing validates 1000+ concurrent users without degradation
- SSL/HTTPS enabled for all traffic with valid certificate
- Domain configured and accessible at www.alldayeverydayrecords.com
- SEO optimization with proper meta tags, Open Graph, and schema markup
- Error logging and monitoring system operational
- Production environment variables configured securely
- Database connection pooling and query optimization
- CDN integration for static assets (optional but recommended)
- Security audit completed with no critical vulnerabilities
- Backup and disaster recovery procedures documented

**Dependencies**: S8.1, S8.2, S8.3, S8.4, S8.6 (all sprint features complete)

**Developer Notes**:
- **Performance Optimization**:
  - Implement React.lazy() for code splitting on page components
  - Add `loading="lazy"` to all image elements
  - Vite build optimization: analyze bundle size, tree shaking
  - Implement service worker for offline functionality (optional)
  - Optimize Material-UI bundle size with tree-shaking imports
  
- **SEO Implementation**:
  - Add React Helmet or Vite plugin for meta tags
  - Implement Open Graph tags for social sharing
  - Add structured data (JSON-LD) for releases and artists
  - Create sitemap.xml and robots.txt
  - Ensure semantic HTML and proper heading hierarchy
  
- **Production Deployment**:
  - Configure hosting (Vercel, Netlify, or VPS)
  - Set up CI/CD pipeline for automated deployments
  - Configure environment variables (API endpoints, keys)
  - SSL certificate installation and HTTPS enforcement
  - Domain DNS configuration and propagation
  - Database migration to production MySQL instance
  - PHP backend deployment with proper CORS configuration
  
- **Monitoring & Logging**:
  - Implement error tracking (Sentry or similar)
  - Set up performance monitoring (Google Analytics, Lighthouse CI)
  - Configure server-side logging for PHP backend
  - Set up uptime monitoring and alerts
  
- **Security Hardening**:
  - Review all API endpoints for SQL injection vulnerabilities
  - Implement rate limiting on admin endpoints
  - Validate and sanitize all user inputs
  - Enable security headers (CSP, HSTS, X-Frame-Options)
  - Regular dependency updates and security patches

**File locations**:
- `frontend/vite.config.ts` (MODIFIED - optimization settings)
- `frontend/src/main.tsx` (MODIFIED - code splitting)
- `frontend/public/robots.txt` (NEW)
- `frontend/public/sitemap.xml` (NEW)
- Production deployment scripts and documentation
- Environment configuration files

---

### S8.6: Backend Security Analysis & Hardening
**Priority**: HIGH  
**Status**: IN PROGRESS ⚙️  
**Estimate**: 8-10 hours  
**Started**: December 14, 2025

**User Story**:  
As a product owner, I want the PHP backend thoroughly analyzed for security vulnerabilities so that the platform is protected against common web attacks and data breaches.

**Implementation Progress**:
- ✅ **Security Audit Complete** - Comprehensive analysis of all 20 backend PHP files
- ✅ **Increment 1: CSRF Protection** - Implementation complete, testing pending
  - Backend: 3 security functions, 6 admin endpoints protected
  - Frontend: Token capture, storage, and header inclusion
  - Status: Ready for end-to-end testing
- ⚙️ **Increment 2: Rate Limiting** - Implementation complete, testing pending
  - Database migration applied (login_attempts table)
  - 5 failed attempts → 15 minute lockout per IP
  - Status: Ready for functional testing
- ⏸️ **Increments 3-8** - Pending (security headers, session security, input validation, error audit, file upload, documentation)

**Completed Work**:
- Comprehensive security audit documented in `docs/sprints/implementations/s8.6-security-audit-plan.md`
- CSRF protection: generateCSRFToken(), validateCSRFToken(), requireCSRFToken()
- Rate limiting: checkRateLimit(), recordFailedLogin(), clearFailedLogins(), requireRateLimit()
- Database schema: login_attempts table for tracking failed login attempts
- Frontend integration: csrfToken in AuthContext, X-CSRF-TOKEN header in API requests
- Build fixes: HomepageVideo type, unused import cleanup

**Acceptance Criteria**:
- Complete security audit of all PHP backend files performed
- SQL injection vulnerabilities identified and remediated with prepared statements
- XSS (Cross-Site Scripting) vulnerabilities identified and fixed with input sanitization
- CSRF (Cross-Site Request Forgery) protection implemented for state-changing operations
- Authentication and session security validated (session hijacking, fixation prevention)
- File upload security verified (type validation, path traversal prevention)
- Input validation and sanitization implemented for all user inputs
- Output encoding applied to prevent injection attacks
- Error messages sanitized to prevent information disclosure
- Security headers configured (X-Frame-Options, X-Content-Type-Options, etc.)
- Rate limiting considered for authentication and sensitive endpoints
- Security findings documented with severity ratings and remediation status
- Code review checklist completed for all API endpoints

**Dependencies**: None (can run in parallel with other stories)

**Developer Notes**:
- **Files to Audit**:
  - `backend/api/config.php` - Database credentials, security settings
  - `backend/api/database.php` - Database connection and query execution
  - `backend/api/security.php` - Authentication and authorization functions
  - `backend/api/login.php` - Login endpoint security
  - `backend/api/logout.php` - Session management security
  - `backend/api/get-releases.php` - SQL injection, output encoding
  - `backend/api/get-releases-by-id.php` - Parameter validation
  - `backend/api/upsert-release.php` - Input validation, SQL injection
  - `backend/api/delete-release.php` - Authorization, CSRF protection
  - `backend/api/upload-cover-image.php` - File upload security
  - `backend/api/update-homepage-videos.php` - Input validation
  - `backend/api/get-user-info.php` - Session security
  - All other API endpoints in `backend/api/` directory

- **Security Checklist**:
  - [ ] **SQL Injection**: All queries use prepared statements with bound parameters
  - [ ] **XSS Prevention**: All output properly escaped with `htmlspecialchars()`
  - [ ] **CSRF Protection**: Token validation for POST/PUT/DELETE operations
  - [ ] **Authentication**: Secure session management, proper password hashing
  - [ ] **Authorization**: Role-based access control enforced on all admin endpoints
  - [ ] **Input Validation**: Whitelist validation for all user inputs
  - [ ] **File Upload**: Type validation, size limits, secure storage paths
  - [ ] **Error Handling**: Generic error messages, detailed logging server-side only
  - [ ] **Headers**: Security headers configured (CSP, HSTS, etc.)
  - [ ] **Rate Limiting**: Brute force protection on login endpoint
  - [ ] **Session Security**: HTTPOnly, Secure, SameSite cookie flags
  - [ ] **Database Security**: Least privilege principle, connection encryption

- **Common Vulnerabilities to Check**:
  1. Direct use of `$_GET`, `$_POST`, `$_FILES` without validation
  2. String concatenation in SQL queries instead of prepared statements
  3. Missing authentication checks on admin endpoints
  4. Unrestricted file uploads without type/size validation
  5. Session fixation vulnerabilities (not regenerating session IDs)
  6. Information disclosure in error messages
  7. Missing CORS validation allowing unauthorized origins
  8. Hardcoded credentials or sensitive data in code

- **Remediation Pattern Examples**:
  ```php
  // BAD - SQL Injection vulnerable
  $query = "SELECT * FROM releases WHERE id = " . $_GET['id'];
  
  // GOOD - Prepared statement
  $stmt = $pdo->prepare("SELECT * FROM releases WHERE id = ?");
  $stmt->execute([$_GET['id']]);
  
  // BAD - XSS vulnerable
  echo $_POST['title'];
  
  // GOOD - Output encoding
  echo htmlspecialchars($_POST['title'], ENT_QUOTES, 'UTF-8');
  
  // BAD - No input validation
  $email = $_POST['email'];
  
  // GOOD - Input validation
  $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
  if (!$email) {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid email format']);
      exit;
  }
  ```

- **Deliverables**:
  - Security audit report documenting findings and fixes
  - Updated PHP files with security hardening applied
  - Security.md documentation with security best practices
  - Code review checklist for future development

**File locations**:
- `backend/api/*.php` (REVIEW & MODIFY - all endpoints)
- `docs/security/security-audit-report.md` (NEW - findings documentation)
- `docs/security/security-checklist.md` (NEW - ongoing security validation)
- `backend/api/security.php` (MODIFY - enhanced security functions)

---

### S8.7: 30-Second Audio Preview System
**Priority**: MEDIUM  
**Status**: COMPLETE ✅  
**Estimate**: 8-10 hours  
**Completion Date**: December 20, 2025  
**Consolidated**: This story was merged into S8.2 implementation as a unified audio preview feature

**Note**: See S8.2 for complete implementation details. The functionality originally planned for S8.7 (MP3 file upload, validation, simple playback controls) was implemented as part of S8.2, creating a single cohesive audio preview system rather than two separate implementations.

**User Story**:  
As a visitor viewing a release detail page, I want to listen to a short audio preview so that I can sample the music before deciding to stream or purchase.

**Acceptance Criteria**:
- Audio preview toggle icon (waveform/speaker) displays on release detail pages when preview is available
- Icon is hidden when no audio preview exists for a release
- Clicking icon plays/pauses the audio preview
- Icon animates during playback to indicate active state (pulsing or waveform animation)
- Audio preview automatically stops after 30 seconds of playback
- Audio pauses when user navigates away from release detail page
- Admin can upload MP3 preview file in release upsert form via "MP3 Preview" field
- File upload validates MP3 format, 2MB max size, and 35 seconds max duration
- Client-side validation checks audio duration before upload
- Server-side validation enforces file type, size, and duration limits
- Current preview audio filename displays in admin edit form when preview exists
- Admin can delete and replace existing preview audio files
- Old preview audio file automatically deleted when uploading new one for same release
- Audio files stored in file system at `backend/uploads/previews/`
- Database stores preview URL in `preview_audio_url` column
- Responsive audio controls work on mobile and desktop
- No progress bar displayed (simple play/pause toggle only)

**Dependencies**: None (extends Sprint 3 release detail pages and admin CRUD)

**Developer Notes**:
- **Database Migration**:
  - Create migration `008_add_audio_preview.sql`
  - Add column: `preview_audio_url VARCHAR(500) NULL` to `releases` table
  - Add index on `preview_audio_url` for query optimization

- **Backend Implementation**:
  - Create `upload-preview-audio.php` endpoint (similar to upload-cover-image.php)
  - File validation: Check MP3 MIME type, max 2MB size
  - Audio duration validation using getID3 library or similar
  - Store files as: `{release_id}_preview.mp3` in `backend/uploads/previews/`
  - Update `upsert-release.php` to handle preview_audio_url field
  - Update `get-releases-by-id.php` to return preview_audio_url
  - Implement delete logic: remove old file when uploading new one

- **Frontend - ReleaseDetail Component**:
  - Create `AudioPreviewPlayer.tsx` component
  - Use HTML5 `<audio>` element with custom controls
  - Implement waveform/speaker icon from Material-UI or custom SVG
  - Icon states: hidden (no audio), static (paused), animated (playing)
  - Animation: CSS keyframes for pulsing or waveform effect
  - Playback limit: Use `ontimeupdate` event to stop at 30 seconds
  - Page navigation: useEffect cleanup to pause audio on unmount
  - Position near release title or cover image

- **Frontend - Admin Form**:
  - Add "MP3 Preview" file input field in AdminDashboard release form
  - Client-side validation using HTML5 Audio API:
    ```javascript
    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      if (audio.duration > 35) {
        alert('Audio must be 35 seconds or less');
      }
    };
    ```
  - Display current filename if preview exists: "Current: preview.mp3"
  - Add "Delete Preview" button for existing previews
  - Show upload progress indicator during file upload
  - Validate file extension (.mp3) and MIME type before upload

- **Audio Player Implementation**:
  - HTML5 audio element: `<audio ref={audioRef} src={previewUrl} />`
  - Play/pause toggle: `audioRef.current.play()` / `pause()`
  - Time limit enforcement:
    ```javascript
    audioRef.current.ontimeupdate = () => {
      if (audioRef.current.currentTime >= 30) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
    ```
  - Icon animation: CSS class toggle on play/pause state

- **File Storage Structure**:
  ```
  backend/uploads/previews/
    ├── 1_preview.mp3
    ├── 2_preview.mp3
    └── 15_preview.mp3
  ```

- **Security Considerations**:
  - Validate file extension AND MIME type (check magic bytes)
  - Limit file size to prevent DoS attacks (2MB max)
  - Store files outside web root if possible, serve via PHP script
  - Sanitize filename to prevent path traversal attacks
  - Rate limit upload endpoint to prevent abuse

- **Audio Format Support**:
  - MP3 only for initial implementation (simplest, widest browser support)
  - HTML5 audio supports: MP3, WAV, OGG, M4A (browser-dependent)
  - Future enhancement: Accept multiple formats, convert server-side if needed

**Technical Rationale**:
- File system storage preferred over database BLOBs for performance and scalability
- Client-side duration check provides immediate feedback before upload
- Server-side validation ensures security and data integrity
- 30-second limit balances preview value with copyright considerations
- Simple toggle interface minimizes UI complexity while providing core functionality

**File locations**:
- `backend/database/migrations/008_add_audio_preview.sql` (NEW)
- `backend/api/upload-preview-audio.php` (NEW)
- `backend/api/upsert-release.php` (MODIFIED - add preview_audio_url field)
- `backend/api/get-releases-by-id.php` (MODIFIED - return preview_audio_url)
- `frontend/src/components/AudioPreviewPlayer.tsx` (NEW)
- `frontend/src/pages/ReleaseDetailPage.tsx` (MODIFIED - integrate audio player)
- `frontend/src/pages/AdminDashboard.tsx` (MODIFIED - add MP3 upload field)
- `frontend/src/types/Release.ts` (MODIFIED - add preview_audio_url field)

---

## Integration Notes

### Cross-Story Integration
- S8.1 (Carousel) works independently but enhances homepage UX
- S8.2 (Audio Widget) and S8.7 (Audio Preview) both handle audio but serve different purposes (streaming vs preview)
- S8.3 (Social) and S8.7 (Audio Preview) both extend release detail pages and admin forms
- S8.4 (Labels) is standalone quick fix
- S8.6 (Security) ensures all backend code is hardened before production
- S8.5 (Deployment) integrates all previous work into production environment

### Technical Integration Points
- Audio preview (S8.7) and social media (S8.3) require coordinated database migrations
- Admin dashboard needs form updates for S8.2, S8.3, and S8.7
- Release detail page integrates audio preview player, audio widget, and social links
- Security audit (S8.6) may identify issues requiring fixes across multiple files
- Performance optimization (S8.5) affects all components from all sprints
- S8.7 follows same file upload pattern as S3.5 (cover image uploads)

---

## Success Metrics

- Homepage carousel engagement increases with auto-rotation
- Audio player usage tracked (play events, completion rates)
- Audio preview engagement measured (play rate per release view, average listen duration)
- Social media click-through rates measured
- Security audit shows zero critical vulnerabilities
- Page load times consistently under 3 seconds (Lighthouse score > 90)
- Production uptime > 99.5% in first month
- Zero security incidents in production
- SEO improvements: indexed pages, search ranking baseline established

---

## Foundation for Future Work

Sprint 8 completion establishes:
- Production-ready platform with full feature set
- Security-hardened backend infrastructure
- Performance baseline for future optimization
- Monitoring and logging infrastructure for issue detection
- SEO foundation for organic traffic growth
- Multimedia integration patterns for future content types
- Scalable deployment pipeline for ongoing updates

---

## Technical Rationale

**Story Selection Justification**:
1. **S8.1 (Carousel)**: Low-risk UX enhancement with high user engagement value
2. **S8.2 (Audio Player)**: Core content feature enabling music streaming integration
3. **S8.3 (Social Media)**: Industry-standard feature for artist promotion and engagement
4. **S8.4 (Label Corrections)**: Quick fix ensuring content accuracy
5. **S8.5 (Production)**: Critical final step for platform launch and user access
6. **S8.6 (Security)**: Essential security hardening before production deployment
7. **S8.7 (Audio Preview)**: Complements audio player with quick preview functionality for user engagement

**Dependency Strategy**:
- Stories 1-4, 6, and 7 are independent and can be developed in parallel
- S8.5 depends on completion of all other stories to ensure production readiness
- S8.6 (Security) must complete before S8.5 (Deployment)
- S8.7 follows established upload pattern from S3.5 (minimal risk)
- Minimal dependency chain enables flexible sprint execution

**Technical Debt Considerations**:
- Audio player (S8.2) and audio preview (S8.7) establish pattern for future multimedia widgets
- Audio preview file upload reuses pattern from cover image uploads (consistent architecture)
- Social media integration creates reusable URL validation utilities
- Security audit creates ongoing security review process
- Performance optimization work benefits entire application
- Production deployment experience informs future deployment automation

---

## Definition of Done
- All acceptance criteria met for each story
- Code reviewed and merged to main branch
- Documentation updated (README, requirements roadmap, sprint stories)
- Security vulnerabilities addressed with no critical issues
- Performance targets achieved (< 3s page load)
- Responsive behavior validated across mobile, tablet, desktop
- Production deployment successful and monitored
- No regressions in existing functionality from Sprints 1-7
