## Why

The Financial Roles sidebar currently scrolls with page content, making it difficult to access role selection, Chama reminders, and sync status when users scroll through long content. This reduces usability and requires users to scroll back up to access essential controls.

## What Changes

- Make the Financial Roles sidebar sticky to the viewport so it remains visible during scrolling
- Preserve existing responsive behavior on smaller screens (sidebar collapse/hide)
- Maintain all current functionality including role selection, Chama reminder card, sync status display
- Keep theme-aware styling intact
- No changes to data logic or sidebar content

## Capabilities

### New Capabilities
- `sticky-sidebar-layout`: Implement viewport-sticky positioning for the Financial Roles sidebar while maintaining responsive behavior

### Modified Capabilities
- `responsive-ui`: Update requirements to include sticky positioning behavior for sidebar components

## Impact

- Affected components: Financial Roles sidebar component and related layout containers
- CSS/styling changes for sticky positioning
- Responsive breakpoints may need adjustment for optimal mobile experience
- No API or data layer changes required
