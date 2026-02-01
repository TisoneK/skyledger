## Why

The Financial Roles sidebar is not staying visible during content scrolling on desktop, despite a previous implementation attempt. Users still have to scroll back up to access role selection controls, Chama reminders, and sync status, which significantly reduces usability and defeats the purpose of having easily accessible sidebar controls.

## What Changes

- Fix the sticky positioning implementation for the Financial Roles sidebar
- Ensure sidebar remains visible during content scrolling on desktop viewports
- Preserve all existing responsive behavior on mobile devices
- Maintain all current functionality including role selection, Chama reminder card, and theme-aware styling
- No changes to sidebar content, data logic, or features

## Capabilities

### New Capabilities
- `working-sticky-sidebar`: Implement functional sticky positioning that actually keeps the sidebar visible during scroll

### Modified Capabilities
- `sticky-sidebar-layout`: Fix the broken implementation to ensure proper sticky behavior

## Impact

- Affected components: MainLayout sidebar component in `src/components/layout/main-layout.tsx`
- CSS positioning classes need correction to achieve actual sticky behavior
- Responsive breakpoints must be preserved while fixing desktop sticky functionality
- No API or data layer changes required
