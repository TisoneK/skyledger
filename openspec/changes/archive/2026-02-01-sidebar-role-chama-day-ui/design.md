## Context

The current sidebar implementation uses excessive horizontal space and has poor positioning of the Chama Day container. The layout needs optimization to improve screen real estate utilization while maintaining all existing functionality. The sidebar contains role performance data and a Chama Day container that currently sits in the middle of the sidebar, pushing important content down.

## Goals / Non-Goals

**Goals:**
- Reduce sidebar width by 15-20% while maintaining content readability
- Position Chama Day container at bottom of sidebar with sticky behavior
- Add date/time display to Chama Day container with proper localization
- Update all role icons with consistent styling and accessibility features
- Maintain responsive behavior across all viewport sizes
- Preserve all existing functionality and user interactions

**Non-Goals:**
- Complete sidebar redesign (only width and positioning changes)
- Changes to sidebar content structure or data flow
- Performance optimizations beyond layout adjustments
- New features beyond the specified enhancements

## Decisions

**Layout Approach:**
- Use CSS flexbox with `flex-direction: column` and `justify-content: space-between` for sidebar layout
- Apply `margin-top: auto` to Chama Day container to push it to bottom
- Implement responsive width using `max-width` and percentage-based sizing

**Icon Strategy:**
- Replace existing icons with SVG components for better scalability
- Implement consistent sizing (24px) and color scheme matching sidebar theme
- Use Lucide React icons for consistency with existing design system

**Date/Time Implementation:**
- Use JavaScript's `Intl.DateTimeFormat` for localization
- Default to 14:00 with ability to override via configuration
- Format as DD/MM/YYYY, HH:mm based on user locale

## Risks / Trade-offs

**Risk:** Reduced sidebar width may clip content on smaller screens
→ Mitigation: Implement responsive breakpoints and ensure content wraps properly

**Risk:** Sticky positioning may interfere with sidebar scrolling
→ Mitigation: Test scroll behavior and adjust positioning strategy if needed

**Trade-off:** Simpler CSS approach vs. complex JavaScript positioning
→ Decision: Use CSS-only solution for better performance and maintainability

**Risk:** Icon changes may affect user recognition
→ Mitigation: Maintain similar icon concepts and provide proper alt text
