## Context

Currently, the Quick Actions section is embedded within the weekly snapshot component body (lines 274-298 in `weekly-snapshot.tsx`), positioned in the middle of the dashboard content. This creates poor UX by placing commonly used actions away from the main navigation area and limits accessibility across different pages.

The existing header in `MainLayout` already contains the theme toggle and sync status on the right side, with the logo/title on the left. There's available space in the middle section where we can add the Quick Actions for better visibility and access.

## Goals / Non-Goals

**Goals:**
- Move Quick Actions from embedded weekly snapshot location to the header for persistent access
- Maintain all existing Quick Actions functionality (Add Transaction, View Analytics, Export Report)
- Ensure responsive design works across mobile/tablet/desktop
- Preserve existing header layout and styling
- Remove the embedded Quick Actions section from weekly snapshot component

**Non-Goals:**
- Creating a separate navigation toolbar component (simpler approach using existing header)
- Modifying the overall header structure or positioning
- Changing the existing Quick Actions functionality
- Adding new actions beyond the current three

## Decisions

### Decision 1: Use existing header instead of separate toolbar component
**Rationale:** The existing header already has the right structure, sticky positioning, and global visibility. Adding Quick Actions to the header's middle section is simpler than creating a new component and avoids layout complexity.

**Alternatives considered:**
- Separate toolbar below header: More complex, potential layout conflicts
- Floating action button: Limited space, poor for multiple actions

### Decision 2: Add Quick Actions to header's middle flex section
**Rationale:** The header uses flexbox with logo on left and controls on right. The middle section naturally accommodates additional elements without disrupting the existing layout.

**Implementation:** Add Quick Actions between the logo div (line 123) and the right-side controls div (line 126).

### Decision 3: Responsive behavior with conditional visibility
**Rationale:** Mobile space is limited, so Quick Actions should adapt to screen size while maintaining functionality.

**Implementation:**
- Desktop (md+): Show all Quick Actions as buttons
- Mobile: Show "Actions" button that opens a dropdown/modal with the three options

### Decision 4: Reuse existing Quick Actions logic
**Rationale:** The current Quick Actions in weekly snapshot already have the correct functionality. We'll extract and reuse this logic rather than reimplementing.

**Implementation:** Move the Quick Actions buttons and their handlers to a shared component that can be used in both locations during transition, then remove from weekly snapshot.

## Risks / Trade-offs

**Risk**: Header crowding on smaller screens
→ **Mitigation**: Implement responsive design with collapsible actions on mobile

**Risk**: Breaking existing header styling or layout
→ **Mitigation**: Use existing button variants and spacing, test thoroughly across breakpoints

**Trade-off**: Slightly larger header height
→ **Acceptable**: Better UX outweighs minimal space cost, header already has adequate height

**Risk**: Quick Actions state management complexity
→ **Mitigation**: Keep actions stateless, reuse existing handlers from weekly snapshot

## Migration Plan

1. Extract Quick Actions component from weekly snapshot
2. Add Quick Actions to header middle section with responsive behavior
3. Test functionality and responsiveness across all breakpoints
4. Remove embedded Quick Actions section from weekly snapshot
5. Verify all Quick Actions work correctly from new location

## Open Questions

- Should Quick Actions be visible on all pages or only dashboard?
- Do we need to adjust header z-index or other styling?
- Should we add any animation or transition effects?
