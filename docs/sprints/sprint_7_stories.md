# Sprint 7 User Stories
**Status**: 25% COMPLETE 🏗️  
**Duration**: 2 weeks  
**Focus**: Release Page Enhancements  
**Started**: December 13, 2025

---

## Sprint Overview
Sprint 7 enhances the release browsing experience with alphabetical navigation, improved sorting, design refinements to match the nickel-and-dime reference site, and a 2-column video layout for release detail pages. Building on the existing release infrastructure from Sprints 2, 3, and 6, this sprint focuses on improving discoverability and visual consistency across the platform.

## Sprint Goals
1. Implement A-Z alphabetical navigation widget for releases and videos pages
2. Add alphabetical sorting by artist name (primary) and title (secondary)
3. Match release card design to nickel-and-dime site reference
4. Create 2-column video layout for release detail pages with responsive mobile stacking
5. Maintain design consistency with existing Material-UI theme

---

## Progress Tracker

| Story ID | Title | Status | Priority |
|----------|-------|--------|----------|
| S7.1 | A-Z Alphabetical Navigation Widget | COMPLETE ✅ | HIGH |
| S7.2 | Alphabetical Release Sorting | PENDING ⏸️ | HIGH |
| S7.3 | Design Matching to nickel-and-dime Reference | PENDING ⏸️ | MEDIUM |
| S7.4 | 2-Column Video Layout on Detail Pages | PENDING ⏸️ | MEDIUM |

---

## User Stories

### S7.1: A-Z Alphabetical Navigation Widget
**Priority**: HIGH  
**Status**: COMPLETE ✅  
**Estimate**: 6-8 hours  
**Completion Date**: December 14, 2025

**User Story**:  
As a visitor browsing releases or videos, I want an A-Z alphabetical navigation widget so that I can quickly jump to artists or content starting with a specific letter.

**Acceptance Criteria** (Updated per user clarifications):
- [x] Alphabetical navigation widget displays A-Z letters **VERTICALLY on RIGHT SIDE** (not horizontal at top)
- [x] Clicking a letter smoothly scrolls to the first release with an artist name starting with that letter
- [x] Active letter visually highlighted in **RED** (changed from orange #ff6b35 per user request)
- [x] Letters with no matching content are grayed out (opacity 0.3, disabled state)
- [x] Widget responsive (40px desktop → 32px tablet → 24px mobile → hidden <600px)
- [x] Navigation reusable component used on Releases, Discography, AND Videos pages
- [x] Smooth scroll behavior with 120px offset to avoid header overlap
- [x] **STICKY POSITIONING** - navigation fixed to right side while scrolling

**Dependencies**:
- Sprint 6 complete (release categorization and filtering)
- Releases page with sufficient content for alphabetical navigation
- Material-UI components for consistent styling

**Developer Notes**:
- Use `useRef` to create refs for each letter section
- Implement `scrollIntoView({ behavior: 'smooth', block: 'start' })` for smooth scrolling
- Use Material-UI Stack/ButtonGroup for horizontal letter layout
- Consider `useMemo` to calculate which letters have content
- Group releases by first letter of artist name for section headers
- Ensure accessibility with proper ARIA labels for navigation
- Component name: `AlphabeticalNavigation` or `AlphaNav`
- Consider sticky positioning for persistent navigation while scrolling

**Implementation Summary**:
- Created reusable AlphabeticalNav component with vertical right-side layout
- Integrated alphabetical navigation on Releases, Discography, AND Videos pages
- Implemented smooth scroll-to-section with IntersectionObserver for active letter tracking
- Added responsive design (hidden <600px, scaled sizing on mobile/tablet/desktop)
- Active letter highlighted in RED (matching navbar), available letters WHITE, disabled grayed
- Letter section headers with RED bottom border for visual consistency
- **BONUS**: YouTube URL validation added to AdminDashboard and VideoManageDialog

**Technical Implementation**:
- Component: `AlphabeticalNav.tsx` with TypeScript interface
- Letter grouping: `useMemo` extracts artist from `artists_with_roles` field
- Active tracking: IntersectionObserver with `-100px 0px -80% 0px` rootMargin
- Scroll handler: `window.scrollTo` with smooth behavior and 120px header offset
- Initial state: First available letter set as active on page load
- Immediate feedback: `setActiveLetter` called on click before scroll animation

**Pattern Compliance**:
✅ Component Architecture Pattern - AlphabeticalNav with TypeScript props
✅ State Management Pattern - useState for activeLetter, useMemo for grouping
✅ Performance Patterns - useCallback for handlers, IntersectionObserver for efficiency
✅ No pattern deviations from design-patterns.md

**Files Modified**:
- `frontend/src/components/AlphabeticalNav.tsx` (NEW - 85 lines)
- `frontend/src/components/index.ts` (MODIFIED - added export)
- `frontend/src/pages/Releases.tsx` (MODIFIED - major integration)
- `frontend/src/pages/Discography.tsx` (MODIFIED - major integration)
- `frontend/src/pages/Videos.tsx` (MODIFIED - major integration)
- `frontend/src/pages/AdminDashboard.tsx` (MODIFIED - YouTube validation)
- `frontend/src/components/VideoManageDialog.tsx` (MODIFIED - YouTube validation)

---

### S7.2: Alphabetical Release Sorting
**Priority**: HIGH  
**Status**: PENDING ⏸️  
**Estimate**: 3-4 hours

**User Story**:  
As a visitor browsing releases, I want releases sorted alphabetically by artist name and then by title so that I can easily find releases in a predictable order.

**Acceptance Criteria**:
- [ ] Releases sorted alphabetically by `artist_name` as primary sort key
- [ ] Releases with the same artist name sorted alphabetically by `title` as secondary sort key
- [ ] Sorting is case-insensitive (lowercase comparison)
- [ ] Sorting logic applies to both Releases and Discography pages
- [ ] Sorting performance optimized using `useMemo` to prevent unnecessary re-sorts
- [ ] Backend option: Consider implementing sorting in PHP API for consistency across clients
- [ ] Sorting maintains category filtering (releases vs discography categorization)
- [ ] Artists with special characters or numbers sorted logically (e.g., "The" prefix handling optional)

**Dependencies**:
- Sprint 6 complete (release categorization)
- Releases page and Discography page functional

**Developer Notes**:
- Implement custom comparator: `(a, b) => a.artist_name.toLowerCase().localeCompare(b.artist_name.toLowerCase()) || a.title.toLowerCase().localeCompare(b.title.toLowerCase())`
- Wrap sorting logic in `useMemo` with `releases` array as dependency
- Alternative: Add `?sort=alphabetical` parameter to `/get-releases.php` API
- Consider future UI toggle between alphabetical and chronological sorting
- File to modify: `Releases.tsx`, `Discography.tsx`
- Optional: Add `ORDER BY artist_name ASC, title ASC` to SQL queries in `get-releases.php`
- Ensure sorting works correctly with pagination if implemented in future sprints

---

### S7.3: Design Matching to nickel-and-dime Reference
**Priority**: MEDIUM  
**Status**: PENDING ⏸️  
**Estimate**: 4-6 hours

**User Story**:  
As a product owner, I want the release card artwork and text sizes to match the nickel-and-dime reference site so that the design is consistent with our brand aesthetic.

**Acceptance Criteria**:
- [ ] Release card cover image dimensions match nickel-and-dime site measurements
- [ ] Typography sizes (artist name, release title, format) match reference site
- [ ] Font weights and text hierarchy match reference design
- [ ] Card spacing, padding, and margins align with nickel-and-dime layout
- [ ] Hover effects and interactions match reference site behavior
- [ ] Design adjustments maintain responsiveness across mobile, tablet, desktop breakpoints
- [ ] Color palette remains consistent with existing theme (secondary #ff6b35, etc.)
- [ ] Changes apply to both Releases and Discography pages

**Dependencies**:
- Access to nickel-and-dime reference site for measurements
- Sprint 2/3 complete (ReleaseCard component exists)
- Existing Material-UI theme and component library

**Developer Notes**:
- Inspect nickel-and-dime site with browser DevTools to extract exact CSS measurements
- File to modify: `ReleaseCard.tsx` component
- Update Material-UI Typography variant props or apply custom `sx` styles
- Image sizing: Update `maxWidth`, `height`, `aspectRatio` CSS properties
- Consider using Material-UI `CardMedia` component with consistent aspect ratio
- Document reference measurements in comments or implementation plan
- Before/after screenshots recommended for visual validation
- Ensure changes don't break existing hover effects from Sprint 3

---

### S7.4: 2-Column Video Layout on Detail Pages
**Priority**: MEDIUM  
**Status**: PENDING ⏸️  
**Estimate**: 4-5 hours

**User Story**:  
As a visitor viewing a release detail page, I want streaming videos displayed in a 2-column layout so that I can see multiple videos at once without excessive scrolling.

**Acceptance Criteria**:
- [ ] Release detail pages display YouTube videos in 2-column grid layout on desktop/tablet viewports
- [ ] Video layout stacks to single column on mobile viewports (< 600px width)
- [ ] Each video maintains 16:9 aspect ratio with responsive iframe sizing
- [ ] Videos load with appropriate spacing/gap between columns and rows
- [ ] Layout handles odd numbers of videos gracefully (last video spans appropriately)
- [ ] Video titles/descriptions remain visible and properly formatted
- [ ] Layout uses CSS Grid or Material-UI Grid for responsive behavior
- [ ] Video section has clear heading (e.g., "Videos" or "Watch")

**Dependencies**:
- Sprint 3 complete (release detail pages with video embeds exist)
- Sprint 6 complete (dual categorization for releases)
- YouTube video embeds functional

**Developer Notes**:
- File to modify: `ReleaseDetail.tsx`
- Use CSS Grid: `display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;`
- Material-UI breakpoint: `{ xs: 1, md: 2 }` for responsive columns
- Alternative: Material-UI Grid2 component with responsive `columns` prop
- Ensure iframe responsiveness: wrapper div with `position: relative; padding-bottom: 56.25%; height: 0;` and iframe with `position: absolute; width: 100%; height: 100%;`
- Consider extracting VideoGrid as separate component for reusability
- Handle cases where release has 0, 1, or many videos
- Maintain existing video data from `youtube_url`, `youtube_url2` fields (from Sprint 3 schema)
- Optional: If more than 2 videos exist, consider expanding schema or using array field in future

---

## Implementation Notes

### Sprint Dependencies
- **Sprint 6 COMPLETE**: Dual categorization system with `show_in_releases` and `show_in_discography` flags
- **Sprint 3 COMPLETE**: Release detail pages with YouTube video embeds
- **Sprint 2 COMPLETE**: ReleaseCard component and release browsing infrastructure

### Technical Considerations
- **Performance**: Use `useMemo` and `useCallback` for expensive operations (sorting, filtering)
- **Accessibility**: Ensure alphabetical navigation has proper ARIA labels and keyboard navigation
- **Responsive Design**: All features must work across mobile (< 600px), tablet (600-960px), desktop (> 960px)
- **Material-UI Consistency**: Use theme colors, spacing units, and component variants
- **Component Reusability**: AlphabeticalNavigation component should be generic for future Videos page

### Design References
- **nickel-and-dime site**: Primary design reference for artwork sizing and typography
- **Existing theme**: Secondary color #ff6b35 (vibrant orange-red)
- **Material-UI breakpoints**: xs (< 600px), md (960px+)

### Future Considerations
- Alphabetical navigation could be extended to Videos page in future sprint
- Sorting toggle UI (alphabetical vs chronological) could be added in Sprint 8
- Video layout could be expanded to support more than 2 videos with schema changes
- A-Z navigation could add letter count badges (e.g., "A (5)" for 5 artists starting with A)

---

## Definition of Done
- All acceptance criteria met for each story
- Code reviewed and merged to main branch
- Documentation updated (README, architecture docs if applicable)
- Design matches nickel-and-dime reference site
- Responsive behavior validated across mobile, tablet, desktop
- Performance optimized with React hooks (useMemo, useCallback)
- Accessibility validated (keyboard navigation, ARIA labels)
- No regressions in existing functionality from Sprints 2, 3, 6
