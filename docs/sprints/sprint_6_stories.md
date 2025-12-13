# Sprint 6 User Stories
**Status**: 33% COMPLETE 🏗️  
**Duration**: 2 weeks  
**Focus**: Discography System Implementation

---

## Sprint Overview
Sprint 6 introduces a dual categorization system that allows releases to be classified as current Releases, historical Discography entries, or both simultaneously. Building on the existing release management infrastructure from Sprints 2 and 3, this sprint adds database categorization flags, creates a dedicated Discography page that mirrors the Releases browsing experience, and updates the admin interface with simple checkbox controls for managing release placement across both sections.

## Sprint Goals
1. Extend database schema to support dual categorization (Releases/Discography/Both)
2. Create standalone Discography page with navigation integration
3. Update admin interface with categorization controls
4. Enable releases to appear in Releases page, Discography page, or both
5. Maintain design consistency with existing Releases page patterns

---

## Progress Tracker

| Story ID | Title | Status | Priority |
|----------|-------|--------|----------|
| S6.1 | Discography Database & Categorization System | ✅ COMPLETE | HIGH |
| S6.2 | Discography Page & Navigation | PENDING ⏸️ | HIGH |
| S6.3 | Admin Discography Management Controls | PENDING ⏸️ | HIGH |

---

## User Stories

### S6.1: Discography Database & Categorization System
**Priority**: HIGH  
**Status**: ✅ COMPLETE  
**Estimate**: 4-6 hours  
**Completed**: December 13, 2025

**User Story**:  
As a system administrator, I want a dual categorization system for releases so that I can manage which releases appear in the Releases section, Discography section, or both.

**Acceptance Criteria**:
- [x] Database migration adds `show_in_releases` and `show_in_discography` boolean flags to releases table
- [x] Both flags default to TRUE for backward compatibility with existing releases
- [x] GET endpoint `/get-releases.php` accepts optional `category` parameter ('releases', 'discography', or 'all')
- [x] API filters releases based on categorization flags when category parameter provided
- [x] TypeScript ReleaseOverview interface updated with categorization flags
- [x] Database indexes added on categorization columns for query performance
- [x] Existing releases automatically flagged as show_in_releases=TRUE, show_in_discography=FALSE
- [x] API maintains backward compatibility when no category filter specified

**Implementation Summary**:
- ✅ Created database migration 006_add_discography_categorization.sql
- ✅ Added show_in_releases and show_in_discography boolean columns with appropriate defaults
- ✅ Created composite index idx_releases_categorization for query performance
- ✅ Updated existing releases to show_in_releases=TRUE, show_in_discography=FALSE
- ✅ Extended get-releases.php API to accept optional category parameter
- ✅ Implemented category filtering logic (releases, discography, all, or null)
- ✅ Added showInReleases and showInDiscography fields to TypeScript ReleaseOverview interface
- ✅ Maintained backward compatibility - no parameter returns all releases
- ✅ Added camelCase mapping for categorization fields in API responses

**Files Created**:
- `backend/database/migrations/006_add_discography_categorization.sql` - Database migration
- `docs/sprints/implementations/s6.1-implementation-plan.md` - Implementation plan

**Files Modified**:
- `backend/api/get-releases.php` - Added category parameter support and filtering
- `frontend/src/types/Release.ts` - Added categorization fields to ReleaseOverview

**Dependencies**: None (extends existing releases table from Sprint 2) - COMPLETE ✅

**Technical Notes**:
- Composite index optimizes category filtering queries
- Both admin and public endpoints support category filtering
- Backward compatible - existing API consumers unaffected
- Category parameter validated: 'releases', 'discography', 'all', or null
- Database defaults ensure existing releases maintain current behavior

---

### S6.2: Discography Page & Navigation
**Priority**: HIGH  
**Status**: PENDING ⏸️  
**Estimate**: 5-7 hours

**User Story**:  
As a visitor, I want to access a dedicated Discography page from the navigation bar so I can browse the label's historical releases.

**Acceptance Criteria**:
- Discography link appears in main navigation after Videos
- Navigation order: Home, Releases, Videos, Discography, About, Contact
- Discography page displays grid of historical releases using same layout as Releases page
- Discography page fetches releases with `category=discography` parameter
- Page includes same search and filtering functionality as Releases page
- Releases sorted alphabetically by artist, then title (same as Releases page)
- Page responsive on mobile, tablet, and desktop breakpoints
- Loading, error, and empty states match Releases page patterns
- Discography page accessible at `/discography` route
- ReleaseCard component reused for consistent display

**Dependencies**: S6.1 - Discography Database & Categorization System

**Developer Notes**:
- Create `frontend/src/pages/Discography.tsx` by duplicating Releases.tsx structure
- Update page title and heading to "Discography"
- Modify API call to use `category=discography` parameter: `services.releases.getReleases({ status: 'published', category: 'discography', ... })`
- Add Discography route in `frontend/src/App.tsx`: `<Route path="/discography" element={<Discography />} />`
- Update `frontend/src/components/Navigation.tsx` to add Discography link after Videos
- Reuse ReleaseCard, ReleaseFilters components for consistency
- Follow exact same responsive grid layout as Releases page (1/2/3/4 columns)
- Maintain identical search, sort, and filter functionality
- Update `frontend/src/pages/index.ts` to export Discography component

---

### S6.3: Admin Discography Management Controls
**Priority**: HIGH  
**Status**: PENDING ⏸️  
**Estimate**: 3-5 hours

**User Story**:  
As an administrator, I want checkbox controls for categorizing releases so I can easily control whether releases appear in Releases, Discography, or both sections.

**Acceptance Criteria**:
- Admin release form includes "Show in Releases" checkbox (checked by default)
- Admin release form includes "Show in Discography" checkbox (unchecked by default)
- Both checkboxes can be checked simultaneously for dual placement
- Unchecking both checkboxes hides release from both sections (warning message displayed)
- Checkboxes positioned below existing form fields, above submit button
- POST endpoint `/upsert-release.php` accepts and saves categorization flags
- Existing releases maintain their current categorization when edited
- Admin can change categorization and see immediate effect on public pages
- Success message confirms categorization changes

**Dependencies**: S6.1 - Discography Database & Categorization System

**Developer Notes**:
- Update `frontend/src/pages/AdminDashboard.tsx` release form section
- Add Material-UI Checkbox components for show_in_releases and show_in_discography
- Add to releaseFormData state: showInReleases (default true), showInDiscography (default false)
- Position checkboxes in FormGroup below Description field, above submit button
- Add validation warning if both checkboxes unchecked: "Release will not appear on any public page"
- Update `backend/api/upsert-release.php` to accept show_in_releases and show_in_discography parameters
- Update SQL INSERT and UPDATE statements to include categorization flags
- Follow existing form patterns from video management (S5.3)
- Ensure backward compatibility: if flags not provided, default to show_in_releases=TRUE

---

## Integration Notes

### Cross-Story Dependencies
1. **Database Foundation** (S6.1): Categorization flags must exist before page filtering and admin controls
2. **API Extension** (S6.1 → S6.2): Category parameter enables Discography page filtering
3. **Admin Integration** (S6.1 → S6.3): Database flags enable admin checkbox functionality

### Reusable Components
- `ReleaseCard`: Existing component reused for Discography page display
- `ReleaseFilters`: Existing search and filter component reused for Discography page
- Admin form patterns: Existing release management patterns extended with checkboxes

### Technical Considerations
- Backward compatibility: Existing releases automatically show in Releases only
- Dual categorization: Releases can appear in both sections without duplication
- Performance: Composite indexes ensure efficient filtering on categorization flags
- Consistency: Discography page mirrors Releases page for familiar user experience

---

## Success Metrics

### Functional Completeness
- Releases can be categorized for Releases page, Discography page, or both
- Discography page accessible and functional for all users
- Admin can change categorization with immediate public page updates
- Navigation updated with correct link ordering

### Technical Quality
- Database migration properly indexes categorization flags
- API filtering efficient and backward compatible
- TypeScript types ensure type safety for categorization flags
- Component reuse maintains consistency across pages

### User Experience
- Discography page loads performantly with same UX as Releases page
- Admin checkbox controls intuitive and clearly labeled
- Categorization changes reflect immediately on public pages
- Search and filtering work identically on both pages

---

## Foundation for Next Sprint

Sprint 6 completion enables:
- **Sprint 7**: Release page enhancements with alphabetical navigation can apply to both Releases and Discography pages
- **Future features**: Historical timeline views, year-based filtering for discography
- **Content expansion**: Label can showcase extensive back catalog separately from current releases
- **Admin efficiency**: Simple checkbox controls enable flexible content organization

---

## Technical Rationale

These stories were chosen to:
1. **Extend existing infrastructure**: Builds on proven releases table and API patterns from Sprint 2
2. **Minimize complexity**: Simple boolean flags avoid complex categorization hierarchies
3. **Maximize reuse**: Discography page reuses entire Releases page component structure
4. **Maintain consistency**: Identical UX across Releases and Discography pages reduces learning curve
5. **Enable flexibility**: Dual categorization allows releases to appear in both sections without duplication

The three-story structure follows the established pattern: database foundation → public UI → admin controls. This matches the proven approach from Sprint 5 (Videos) and ensures clean separation of concerns with minimal dependencies.
