## Why

The current sidebar layout takes up too much horizontal space and the Chama Day container is poorly positioned, reducing available screen real estate for the main content. Users need a more efficient layout that maintains functionality while improving space utilization and user experience.

## What Changes

- Reduce sidebar width by adjusting max-width/width CSS properties while maintaining responsive behavior
- Move Chama Day container to bottom of sidebar using flexbox or margin positioning
- Add date and time display to Chama Day container (default 14:00) with localized formatting
- Replace all role icons with new consistent icons while maintaining accessibility

## Capabilities

### New Capabilities
- `sidebar-width-optimization`: Optimizes sidebar width for better space utilization
- `chama-day-positioning`: Repositions Chama Day container to bottom of sidebar with date/time display
- `role-icon-updates`: Updates role icons with consistent styling and accessibility

### Modified Capabilities
- `sticky-sidebar-layout`: Modifies positioning requirements for Chama Day container placement
- `role-performance-grid`: May need adjustments to accommodate reduced sidebar width

## Impact

- Affected components: Main sidebar layout, Chama Day container, role performance display
- CSS modifications for width, positioning, and icon styling
- Responsive design testing across desktop/tablet/mobile viewports
- Accessibility compliance for new icons and layout changes
