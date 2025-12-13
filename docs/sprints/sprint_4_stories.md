# Sprint 4 User Stories
**Status**: 17% COMPLETE 🏗️  
**Duration**: 2-3 weeks  
**Focus**: UI/UX Polish & Homepage Enhancements

---

## Sprint Overview
Sprint 4 introduces UI refinements and homepage enhancements to improve content discoverability and visual consistency. This sprint focuses on search functionality, visual polish, and standardization across the application with minimal backend changes required.

### Sprint Goals
1. Implement homepage search to improve content discoverability
2. Enhance homepage section organization with labels and icons
3. Standardize artist name display order across all pages
4. Fine-tune visual elements (logo opacity, footer text sizing)
5. Complete contact page with PO Box information

---

## Progress Tracker
- **Total Stories**: 6
- **Completed**: 1 ✅
- **In Progress**: 0 🚧
- **Pending**: 5 🔄

| Story ID | Title | Status | Priority |
|----------|-------|--------|----------|
| S4.1 | Homepage Search Functionality | ✅ COMPLETE | HIGH |
| S4.2 | Homepage Section Labels & Icons | 🔄 PENDING | MEDIUM |
| S4.3 | Artist Name Display Standardization | 🔄 PENDING | MEDIUM |
| S4.4 | Logo Background Opacity Adjustment | 🔄 PENDING | LOW |
| S4.5 | Footer Copyright Text Size | 🔄 PENDING | LOW |
| S4.6 | Contact Page PO Box | 🔄 PENDING | LOW |

---

## User Stories

### S4.1: Homepage Search Functionality
**Priority**: HIGH  
**Status**: ✅ COMPLETE  
**Estimate**: 5-8 hours  
**Completed**: December 13, 2025

**User Story**:  
As a visitor, I want to search for releases from the homepage so I can quickly find specific music without navigating to the full releases page.

**Acceptance Criteria**:
- [x] Search input field added to homepage (positioned above Featured Releases)
- [x] Search filters ALL releases (not just recent carousel)
- [x] Search matches artist name and release title (case-insensitive, partial match)
- [x] Autocomplete dropdown appears with matching releases
- [x] Dropdown format: 50x50px thumbnail + "Artist - Title"
- [x] Selecting result navigates to Release Detail page (using release.id)
- [x] Dropdown shows "No releases found" when no matches
- [x] Dropdown closes on outside click
- [x] Search debounced (300ms)
- [x] Results list scrollable (maxHeight: 400px)
- [x] Mobile responsive: search visible and functional on all breakpoints
- [x] Accessibility: ARIA labels and keyboard navigation support

**Implementation Summary**:
- ✅ Created `ReleaseAutocomplete.tsx` component with Material-UI Autocomplete
- ✅ Fetches ALL published releases on mount via `createServices()` factory
- ✅ Client-side filtering with debounced search (300ms using `useDebounce` hook)
- ✅ Custom dropdown rendering: 50x50px thumbnails + "Artist - Title" format
- ✅ Navigation to `/releases/{id}` on selection
- ✅ Integrated at top of homepage (above Featured Releases)
- ✅ Styling matches existing search boxes (semi-transparent white with solid grey dropdown)
- ✅ Removed `catalog_number` field from codebase (cleanup)
- ✅ Removed `slug` field from codebase (using `id` for navigation)

**Design Pattern Compliance**:
- ✅ Factory Pattern: `createServices()` for API access
- ✅ Component Architecture: TypeScript interface, React.FC
- ✅ State Management: `useState` for UI state (no Zustand needed for ephemeral autocomplete state)
- ✅ API Integration: Loading/error states, type-safe responses
- ✅ Responsive Design: Material-UI Container and sx props
- ✅ Accessibility: WCAG 2.1 AA compliance with ARIA attributes

**Files Modified**:
- `frontend/src/components/ReleaseAutocomplete.tsx` - New component
- `frontend/src/pages/Home.tsx` - Integrated search
- `frontend/src/types/Release.ts` - Removed catalog_number and slug
- `frontend/src/pages/ReleaseDetailPage.tsx` - Removed catalog_number display
- `frontend/src/services/releaseService.ts` - Removed slug mapping and getReleaseBySlug
- `frontend/src/pages/ApiTest.tsx` - Removed slug reference
- `frontend/package.json` - Fixed version locking (dayjs, @mui/x-date-pickers)

**Technical Requirements**:
- Reuse existing search logic from Releases page (`useState` for search term)
- Filter `recentReleases` array before passing to carousel
- Add search input component above Recent Releases section
- Match search behavior to Releases page (partial match, case-insensitive)

**Dependencies**:
- Sprint 2: Homepage Recent Releases carousel (S2.3)
- Sprint 3: Releases page search functionality (S3.8)

**Developer Notes**:
- Copy search component structure from `Releases.tsx`
- Consider extracting search logic to custom hook (`useReleaseSearch`) for reusability
- Ensure search UX is consistent between Homepage and Releases page
- Test carousel behavior with 0, 1, and 10+ filtered results

---

### S4.2: Homepage Section Labels & Icons
**Priority**: MEDIUM  
**Status**: 🔄 PENDING  
**Estimate**: 3-4 hours

**User Story**:  
As a visitor, I want clear section labels with icons on the homepage so I can understand the content organization at a glance.

**Acceptance Criteria**:
- [ ] "Recent Releases" section has label with music note icon
- [ ] "Featured Videos" section has label with play button icon
- [ ] Labels use consistent typography (size, weight, color)
- [ ] Icons aligned to left of section labels
- [ ] Spacing between label and content: 16px (2 * theme spacing unit)
- [ ] Labels visible on all breakpoints (mobile, tablet, desktop)
- [ ] Icons use Material-UI icon library (MusicNote, PlayArrow)

**Technical Requirements**:
- Add section header component with icon + text
- Use Material-UI `Typography` variant="h5" for section labels
- Use Material-UI icons: `MusicNote` (Recent Releases), `PlayArrow` (Featured Videos)
- Apply theme spacing for consistent margins

**Dependencies**:
- Sprint 2: Homepage Recent Releases carousel (S2.3)
- Sprint 3: Homepage Featured Videos carousel (S3.4)

**Developer Notes**:
- Create reusable `SectionHeader` component in `frontend/src/components/`
- Props: `title: string`, `icon: React.ReactNode`
- Consider extracting to shared component library if used elsewhere
- Match existing homepage styling (colors, spacing)

---

### S4.3: Artist Name Display Standardization
**Priority**: MEDIUM  
**Status**: 🔄 PENDING  
**Estimate**: 4-6 hours

**User Story**:  
As a visitor, I want artist names displayed consistently (Last Name, First Name) across all pages so I can easily recognize artists without confusion.

**Acceptance Criteria**:
- [ ] All release cards show "Artist Last, Artist First" format
- [ ] Applies to: Homepage carousel, Releases page grid, individual Release Detail page
- [ ] Artist names with single word (e.g., "Prince") display unchanged
- [ ] Artist names with middle names/initials preserve full format (e.g., "King, B.B.")
- [ ] Format function handles edge cases: empty strings, null values, special characters
- [ ] Existing release data not modified in database (formatting applied in frontend only)

**Technical Requirements**:
- Create utility function `formatArtistName(firstName: string, lastName: string): string`
- Apply in `ReleaseCard.tsx`, `Home.tsx`, `ReleaseDetail.tsx`
- Handle edge cases: null/undefined/empty values, single-word names
- Add unit tests for `formatArtistName` utility

**Dependencies**:
- Sprint 1: Release detail page (S1.3)
- Sprint 2: Homepage Recent Releases carousel (S2.3)
- Sprint 3: Releases page grid (S3.8)

**Developer Notes**:
- Place utility in `frontend/src/utils/formatters.ts`
- Consider database schema: verify `artist_first` and `artist_last` columns available
- Test with real data: check for edge cases in production dataset
- Example: `formatArtistName("John", "Doe")` → "Doe, John"
- Example: `formatArtistName("", "Prince")` → "Prince"

---

### S4.4: Logo Background Opacity Adjustment
**Priority**: LOW  
**Status**: 🔄 PENDING  
**Estimate**: 1-2 hours

**User Story**:  
As a visitor, I want the logo background watermark to be slightly more visible so it enhances the brand identity without being distracting.

**Acceptance Criteria**:
- [ ] Logo background opacity increased from 0.15 to 0.25
- [ ] Logo remains visually subtle (does not interfere with content readability)
- [ ] Change applied consistently across all pages (MainLayout)
- [ ] Tested on light and dark content backgrounds
- [ ] No impact on page load performance

**Technical Requirements**:
- Update `MainLayout.tsx` pseudo-element `::before` opacity from 0.15 to 0.25
- Verify z-index layering remains correct (background: 0, content: 1)
- Test on multiple pages: Home, Releases, Videos, Contact, About

**Dependencies**:
- Sprint 3: Logo background watermark implementation

**Developer Notes**:
- Single-line CSS change in `MainLayout.tsx`
- Test on devices with different screen brightness settings
- Consider user feedback: may need further adjustment if too prominent
- Current implementation: `opacity: 0.15` → proposed: `opacity: 0.25`

---

### S4.5: Footer Copyright Text Size
**Priority**: LOW  
**Status**: 🔄 PENDING  
**Estimate**: 1 hour

**User Story**:  
As a visitor, I want the footer copyright text to be smaller and less prominent so it doesn't compete visually with primary content.

**Acceptance Criteria**:
- [ ] Footer copyright text reduced from current size to `0.875rem` (14px)
- [ ] Text remains readable on all devices (mobile, tablet, desktop)
- [ ] Spacing adjusted if necessary to maintain visual balance
- [ ] Accessibility: text meets WCAG 2.1 minimum contrast ratio (4.5:1)

**Technical Requirements**:
- Update footer component typography to `fontSize: '0.875rem'`
- Verify color contrast passes accessibility guidelines
- Test on mobile (320px width) to ensure readability

**Dependencies**:
- Sprint 1: Main layout and footer (S1.1)

**Developer Notes**:
- Update `MainLayout.tsx` footer section or create separate `Footer.tsx` component
- Current size likely `1rem` (16px) → reduce to `0.875rem` (14px)
- Consider using Material-UI `Typography` variant="caption" for semantic consistency
- Test with Chrome DevTools accessibility audit

---

### S4.6: Contact Page PO Box
**Priority**: LOW  
**Status**: 🔄 PENDING  
**Estimate**: 2-3 hours

**User Story**:  
As a visitor, I want to see the label's PO Box address on the Contact page so I can send physical mail if needed.

**Acceptance Criteria**:
- [ ] PO Box address displayed on Contact page
- [ ] Address format: "PO Box [number], [City], [State] [ZIP]"
- [ ] Address positioned below other contact information
- [ ] Typography consistent with existing Contact page styling
- [ ] Icon added (Material-UI `MailOutline` or similar)
- [ ] Mobile responsive: address visible and readable on all breakpoints

**Technical Requirements**:
- Add PO Box section to Contact page component
- Use Material-UI `Typography` for consistent styling
- Add `MailOutline` icon from Material-UI icons
- Store address in environment variable or config (not hardcoded)

**Dependencies**:
- Sprint 1: Contact page basic structure (S1.5)

**Developer Notes**:
- Update `frontend/src/pages/Contact.tsx`
- Add address to `frontend/src/config/constants.ts` or `.env` file
- Example format: "PO Box 12345, Los Angeles, CA 90001"
- Consider adding Google Maps link if physical location exists
- Match existing contact information styling (email, social media links)

---

## Integration Notes

### Cross-Story Dependencies
1. **Search Consistency** (S4.1 → S4.3): Artist name standardization should apply to search results
2. **Section Organization** (S4.2 → S4.1): Search input positioned above "Recent Releases" section label
3. **Visual Hierarchy** (S4.4 + S4.5): Logo opacity and footer text size changes should maintain overall visual balance

### Technical Coordination
- **Shared Components**: `SectionHeader` component (S4.2) may be reused in future sprints
- **Utility Functions**: `formatArtistName` (S4.3) should be unit tested and documented for team use
- **Configuration Management**: PO Box address (S4.6) should be externalized to config file for easy updates

---

## Success Metrics

### Functionality Metrics
- Homepage search returns accurate results in <200ms
- Artist name formatting handles 100% of edge cases without errors
- All visual adjustments (logo opacity, footer text) maintain WCAG 2.1 AA compliance

### User Experience Metrics
- Search feature increases content discoverability (measure via analytics: search usage rate)
- Section labels improve content organization clarity (qualitative user feedback)
- Visual polish enhances brand consistency (design review approval)

### Technical Metrics
- No performance degradation from new features (Lighthouse score maintains 90+)
- All new components pass accessibility audit (0 violations)
- Code coverage for utility functions: 100% (formatArtistName tests)

---

## Foundation for Next Sprint

Sprint 4 establishes:
1. **Reusable Search Pattern**: Homepage search implementation can extend to Videos page in future sprints
2. **Artist Name Formatting**: Standard utility function for consistent artist display across application
3. **Section Organization**: `SectionHeader` component pattern for future content sections
4. **Configuration Management**: Externalized configuration approach (PO Box) for maintainability

These foundations support Sprint 5's focus on advanced filtering, sorting, and content organization enhancements.

---

## Technical Rationale

### Progressive Enhancement Strategy
Sprint 4 follows a progressive enhancement approach:
1. **Core Functionality** (S4.1): Search improves content discovery without breaking existing features
2. **Visual Organization** (S4.2): Section labels add clarity without restructuring layout
3. **Standardization** (S4.3): Artist name formatting improves consistency without data migration
4. **Visual Polish** (S4.4, S4.5): Opacity and text size tweaks refine aesthetics without major changes
5. **Content Completion** (S4.6): PO Box finalizes Contact page information architecture

### Minimal Backend Impact
- All stories are frontend-focused (React component updates)
- No database schema changes required
- No new API endpoints needed
- Leverages existing Sprint 2/3 infrastructure

### Shallow Dependency Chain
- Maximum dependency depth: 2 levels (S4.1 depends on S2.3/S3.8)
- Most stories (S4.2, S4.4, S4.5, S4.6) can be developed in parallel
- S4.3 touches multiple components but uses shared utility (minimal conflict risk)

---

**Last Updated**: December 12, 2025  
**Next Sprint**: Sprint 5 - Advanced Filtering & Content Organization
