## Why

The sidebar navigation is currently using generic Lucide React icons instead of the custom PNG icons that were specifically designed for each role. This creates a mismatch between the intended visual design and the current implementation, reducing brand consistency and user experience.

## What Changes

- Replace Lucide React icons in sidebar navigation with custom PNG icons
- Update sidebar component to use Image components for PNG icons
- Ensure proper sizing and alignment for PNG icons in sidebar buttons
- Maintain responsive behavior and accessibility

## Capabilities

### New Capabilities
- `custom-sidebar-icons`: Implementation of custom PNG icons for sidebar navigation to replace generic icon library

### Modified Capabilities
- None (this is a UI implementation change, not a functional requirement change)

## Impact

- Affected code: `src/components/layout/main-layout.tsx` sidebar navigation
- Dependencies: Remove Lucide icon imports, add Next.js Image imports
- Visual design: Custom icons will reflect brand identity and role-specific imagery
- Performance: PNG icons may have different loading characteristics than SVG icons
