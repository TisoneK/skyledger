## Why

The current icon system has inconsistent sizing across components - sidebar icons are appropriately sized but performance card icons are too small, creating visual hierarchy issues. A centralized icon sizing system would ensure consistent, customizable icon sizes that can be easily adjusted and maintained across all UI contexts.

## What Changes

- Create a centralized icon size configuration system with predefined size presets
- Update RoleIcon component to support contextual sizing based on UI context
- Define size presets for different UI contexts (sidebar, cards, compact, large)
- Apply consistent sizing across all icon usage in sidebar, performance cards, and future components
- Add size customization API that allows global size adjustments

## Capabilities

### New Capabilities
- `icon-size-configuration`: Centralized icon size management system that provides predefined size presets and contextual sizing for role icons across all UI components
- `role-based-icons-with-sizing`: Enhanced role-based icon system that supports contextual sizing and size presets

## Impact

- **Code**: RoleIcon component, sidebar components, performance card components
- **APIs**: RoleIcon props interface, icon size configuration API
- **Dependencies**: CSS-in-JS or Tailwind configuration for size management
- **Systems**: Icon rendering system, component theming system
