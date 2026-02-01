## Why

The Quick Actions section is currently embedded within the weekly snapshot component body, wrongly placed in the middle of the content instead of being positioned in a dedicated navigation toolbar where it belongs. This misplacement creates poor UX and limits accessibility to common actions across the application.

## What Changes

- Add Quick Actions to the existing header component's middle section for persistent access
- Move Quick Actions from the weekly snapshot component body to the header
- Ensure Quick Actions are consistently positioned in the header across all application pages
- Maintain responsive design and accessibility standards in the header layout
- **BREAKING**: Remove embedded Quick Actions section from weekly snapshot component

## Capabilities

### New Capabilities
- `header-quick-actions`: Integration of Quick Actions into the existing header component for persistent access across all pages

### Modified Capabilities
- `weekly-dashboard`: Update requirements to remove embedded Quick Actions section and integrate with header

## Impact

- **Components**: Modified MainLayout header component, modified WeeklySnapshot component
- **Layout**: Header layout changes to accommodate Quick Actions in middle section
- **State Management**: May need to update state handling for Quick Actions
- **Routing**: Ensure header persists across route changes (already handled)
- **CSS**: Header styling updates for Quick Actions positioning and responsive behavior
