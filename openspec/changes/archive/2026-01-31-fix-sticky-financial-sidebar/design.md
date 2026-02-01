## Context

The Financial Roles sidebar in `src/components/layout/main-layout.tsx` was previously modified to use sticky positioning, but the implementation is not working correctly. The sidebar still scrolls with content on desktop instead of staying fixed to the viewport. The current implementation uses `md:sticky md:top-14` classes but may have conflicts with the parent container structure or other CSS properties that prevent proper sticky behavior.

The sidebar contains critical functionality including role selection buttons and a Chama reminder card that users need constant access to. The current broken implementation forces users to scroll back up to access these controls, significantly degrading the user experience.

## Goals / Non-Goals

**Goals:**
- Fix the sticky positioning so the sidebar actually stays visible during content scrolling on desktop
- Ensure the sidebar sticks to the top of the viewport below the header (56px height)
- Preserve all existing responsive behavior on mobile devices
- Maintain all current functionality and styling
- Keep theme-aware styling intact

**Non-Goals:**
- No changes to sidebar content or functionality
- No modifications to mobile responsive behavior
- No changes to data logic or API calls
- No new features or content additions

## Decisions

**Root Cause Analysis**: The current `md:sticky md:top-14` approach may not be working due to parent container constraints. The sidebar is inside a `<div className="flex">` container, and sticky positioning requires the parent to have sufficient height and proper scrolling behavior.

**Container Structure Fix**: Modify the parent container structure to ensure the sidebar can properly stick. This may involve adjusting the flex container or adding a wrapper with proper height constraints.

**Positioning Strategy**: Use a combination of `sticky` positioning with proper container setup rather than relying solely on Tailwind classes. This may require custom CSS or more specific Tailwind configuration.

**Responsive Preservation**: Ensure mobile behavior remains unchanged - the sidebar should continue to use `fixed` positioning with overlay on mobile devices.

## Risks / Trade-offs

**Container Layout Conflicts** → Carefully analyze the parent container structure to avoid breaking the overall layout when implementing sticky positioning

**Mobile Behavior Regression** → Thoroughly test mobile responsive behavior to ensure the fix doesn't interfere with existing mobile functionality

**Performance Impact** → Sticky positioning has minimal performance impact, but monitor for any scroll jank or layout shifts

**Browser Compatibility** → CSS sticky positioning has good browser support, but test across different browsers to ensure consistent behavior

## Migration Plan

1. Analyze current layout structure and identify why sticky positioning isn't working
2. Fix parent container constraints or add wrapper elements as needed
3. Implement corrected sticky positioning with proper top offset
4. Test responsive behavior across all breakpoints
5. Verify all sidebar functionality remains intact
6. Performance testing for smooth scrolling

## Open Questions

- What is preventing the current `md:sticky` implementation from working?
- Does the parent flex container need modification to support sticky positioning?
- Should we use a wrapper element around the sidebar for better sticky control?
- Are there conflicting CSS properties that need to be resolved?
