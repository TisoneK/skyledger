## Context

Currently, the SkyLedger application has inconsistent branding - the main title "SkyLedger" and theme toggle only appear on the dashboard page. The navigation header across all other pages only shows a simple title without the subtitle and lacks theme switching functionality. This creates a disjointed user experience where users must return to the dashboard to change themes.

The current implementation has:
- Navigation header (`main-layout.tsx`) with basic title and sync status
- Dashboard page (`page.tsx`) with full title, subtitle, and theme toggle
- Theme toggle component already exists and is functional
- Responsive design patterns already established in the codebase

## Goals / Non-Goals

**Goals:**
- Provide consistent branding across all pages with title and subtitle
- Make theme switching accessible from any page in the application
- Maintain responsive design and accessibility standards
- Preserve all existing functionality (sync status, mobile menu, etc.)
- Clean up redundant dashboard header for better content space utilization

**Non-Goals:**
- Changing the theme toggle functionality or appearance
- Modifying sync status behavior
- Altering the mobile menu functionality
- Creating new components (reusing existing ThemeToggle)
- Changing the overall layout structure beyond the header

## Decisions

**Header Structure**: Move title/subtitle from dashboard to navigation header
- *Rationale*: Ensures consistent branding across all pages
- *Alternative considered*: Keep dashboard title and add to navigation (rejected as redundant)

**Theme Toggle Placement**: Position theme toggle left of sync status in navigation header
- *Rationale*: Logical grouping of user controls, maintains visual hierarchy
- *Alternative considered*: Right of sync status (rejected for better visual balance)

**Responsive Subtitle**: Hide subtitle on mobile screens (<640px)
- *Rationale*: Maintains clean mobile appearance while preserving desktop experience
- *Alternative considered*: Always show subtitle (rejected for mobile clutter)

**Component Import**: Import ThemeToggle into main layout
- *Rationale*: Reuse existing component, avoid duplication
- *Alternative considered*: Create new header-specific theme component (rejected as unnecessary)

## Risks / Trade-offs

**Mobile Space Constraints** → Mitigation: Use responsive classes to hide subtitle on small screens, maintain theme toggle accessibility

**Import Dependencies** → Mitigation: ThemeToggle already exists and is stable, minimal import overhead

**Visual Hierarchy Changes** → Mitigation: Maintain existing color scheme and typography, only reposition elements

**Backward Compatibility** → Mitigation: No breaking changes to existing functionality, only UI reorganization

## Migration Plan

1. Update main layout to include enhanced header with title, subtitle, and theme toggle
2. Remove redundant header section from dashboard page
3. Test responsive behavior across mobile, tablet, and desktop viewports
4. Verify theme switching functionality works from all pages
5. Validate accessibility with screen readers

## Open Questions

- None identified - all requirements are clear from the existing specification document
