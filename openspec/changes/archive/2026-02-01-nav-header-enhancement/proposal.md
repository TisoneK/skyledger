## Why

Move the main title and theme toggle from the dashboard page to the navigation header to provide consistent branding across all pages and better UX with theme switching accessible from any page.

## What Changes

- Enhance navigation header with title, subtitle, and theme toggle integration
- Remove redundant header section from dashboard page  
- Add responsive subtitle hiding for mobile devices
- Maintain existing sync status functionality alongside theme toggle
- Update imports to include ThemeToggle component in main layout

## Capabilities

### New Capabilities
- `enhanced-navigation-header`: Improved navigation header with consistent branding, title display, subtitle, and integrated theme toggle functionality

### Modified Capabilities
- None (this is primarily UI/UX improvement without changing existing spec requirements)

## Impact

- **Code Changes**: Affects `src/app/layout.tsx` (main layout) and `src/app/page.tsx` (dashboard)
- **Component Dependencies**: Requires importing ThemeToggle component in main layout
- **CSS Classes**: Uses existing Tailwind classes, no new dependencies needed
- **Accessibility**: Maintains existing ARIA labels and screen reader structure
- **Performance**: Minimal DOM changes, improved component organization
