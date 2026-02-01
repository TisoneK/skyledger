## Why

Sidebar icons are currently scattered in the root directory, making the project structure disorganized and harder to maintain. This creates poor developer experience and makes it difficult to manage UI assets systematically.

## What Changes

- Move sidebar icons from root directory to a dedicated `public/icons/sidebar/` folder
- Rename icons to follow consistent naming conventions (kebab-case)
- Update sidebar component references to use new icon paths
- Establish proper asset organization structure for future icons

## Capabilities

### New Capabilities
- `sidebar-icon-management`: Systematic organization and management of sidebar navigation icons with consistent naming and proper folder structure

### Modified Capabilities
- None (this is purely an organizational change, no functional requirement changes)

## Impact

- Affected code: Sidebar navigation components that reference icon paths
- File system: Moving 4 icon files from root to `public/icons/sidebar/`
- Build system: No changes needed (public folder is automatically served)
- Dependencies: None
