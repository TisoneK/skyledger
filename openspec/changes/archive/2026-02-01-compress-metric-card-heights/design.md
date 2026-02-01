## Context

The WeeklySnapshot component displays three MetricCard components (Total Income, Total Expenses, Net Income) in a responsive grid layout. Currently, these cards have excessive vertical height on desktop view, wasting screen real estate that could be used for additional financial data or a more compact layout. The component uses Tailwind CSS with a grid-cols-1 md:grid-cols-3 gap-6 layout.

## Goals / Non-Goals

**Goals:**
- Reduce metric card height by approximately 20-30% on desktop view (md: breakpoint and above)
- Maintain all existing functionality and data display
- Preserve responsive behavior for mobile view
- Keep the same visual hierarchy and readability

**Non-Goals:**
- Changing the overall grid layout structure
- Modifying the data displayed in the cards
- Adding new features or components
- Changing the color scheme or visual design

## Decisions

**Approach 1: Reduce internal padding and spacing**
- Reduce `py-6` to `py-4` in MetricCard component
- Adjust gap between metric value and trend indicator
- Optimize font sizes for better vertical compression

**Approach 2: CSS Custom Properties for responsive heights**
- Use responsive Tailwind classes to apply different heights based on breakpoint
- Apply `h-auto md:h-24` or similar to constrain height on desktop
- Ensure content remains properly aligned and readable

**Chosen Approach:** Combination of both - reduce internal padding while applying responsive height constraints for optimal control.

## Risks / Trade-offs

**Risk:** Text may become too cramped or difficult to read
→ Mitigation: Carefully test readability and adjust font sizes appropriately

**Risk:** Trend indicators or percentage changes may not display properly
→ Mitigation: Ensure all elements maintain proper spacing and alignment

**Trade-off:** Some visual breathing room will be sacrificed for density
→ Acceptable: Current layout is overly spacious, moderate compression improves UX

## Migration Plan

1. Modify MetricCard component styles to reduce vertical padding
2. Apply responsive height constraints for desktop view
3. Test across different screen sizes to ensure responsive behavior
4. Verify all data displays correctly and trends are visible
5. No rollback strategy needed - changes are purely cosmetic CSS modifications

## Open Questions

- What is the target height reduction percentage? (Aim for 20-30%)
- Should the change apply to all MetricCard instances or only WeeklySnapshot?
- Are there any accessibility concerns with reduced spacing?
