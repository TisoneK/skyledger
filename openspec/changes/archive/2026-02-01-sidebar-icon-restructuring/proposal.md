## Why

The current icon structure stores financial role icons in a sidebar-specific directory, preventing reuse across components that need role-based visual representations. This creates code duplication and inconsistent role representation throughout the application.

## What Changes

- **BREAKING**: Move role icons from `icons/sidebar` to new `icons/roles` directory structure
- Update all component references to use new icon paths
- Create reusable role icon system for multiple components
- Modify icon mapping configurations and registry files
- Update build processes that reference icon paths

## Capabilities

### New Capabilities
- `role-based-icons`: Centralized role icon system that provides reusable financial role icons for multiple components including sidebar navigation, role performance cards, and user profile sections

### Modified Capabilities
- `custom-sidebar-icons`: Update existing sidebar icon requirements to use the new role-based icon system instead of sidebar-specific icons

## Impact

- **Code**: Sidebar components, role performance cards, icon mapping configurations
- **APIs**: Icon registry and mapping functions
- **Dependencies**: Next.js Image component usage for role icons
- **Systems**: Build processes and asset optimization for icons
