## Context

The "Am I Moving Forward" component currently uses hard-coded Tailwind classes like `border-green-200`, `bg-green-50`, `text-green-500`, etc. These create poor contrast and visibility in dark mode since they don't adapt to the theme. The Chama Target Tracker component serves as a reference for proper dark mode implementation using semantic color classes and theme-aware styling.

## Goals / Non-Goals

**Goals:**
- Replace hard-coded light colors with theme-aware CSS custom properties
- Ensure proper contrast ratios for text, borders, and status indicators in both light and dark modes
- Align visual styling with the Chama Target Tracker component for consistency
- Maintain all existing functionality, layout, and copy

**Non-Goals:**
- No changes to component logic or data flow
- No modifications to layout structure or component hierarchy
- No changes to text content or user-facing copy

## Decisions

- **Use semantic color classes**: Replace hard-coded colors with Tailwind's semantic classes like `text-destructive`, `text-success`, `border-border`, `bg-card` that automatically adapt to theme
- **Leverage CSS custom properties**: Use shadcn/ui's theme system with CSS variables for consistent theming across light/dark modes
- **Conditional styling based on status**: Use the component's existing `assessment.movingForward` logic to apply appropriate theme-aware classes
- **Progress bar theming**: Use Tailwind's progress component theming system instead of hard-coded background colors

## Risks / Trade-offs

- **Risk**: Theme token availability may not cover all current color choices
  - **Mitigation**: Use closest semantic equivalents and test in both themes
- **Trade-off**: Some visual distinction may be reduced compared to hard-coded colors
  - **Mitigation**: Enhance distinction through proper use of semantic color variants and opacity
