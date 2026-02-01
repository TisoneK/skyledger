## Context

Currently, sidebar navigation icons (`all-roles-icon.png`, `chama-icon.png`, `personal-icon.png`, `side-income-icon.png`) are stored in the project root directory. This creates poor organization and makes asset management difficult. The Next.js application uses a standard public folder structure for static assets.

## Goals / Non-Goals

**Goals:**
- Organize sidebar icons into a proper directory structure
- Establish consistent naming conventions for icons
- Update component references to use new paths
- Create scalable asset organization for future icons

**Non-Goals:**
- Changing the visual design or functionality of sidebar navigation
- Modifying icon sizes or formats
- Changing sidebar component behavior

## Decisions

- **Directory Structure**: Use `public/icons/sidebar/` to follow Next.js conventions for static assets served from root
- **Naming Convention**: Convert to kebab-case (e.g., `all-roles-icon.png` → `all-roles.png`)
- **Path Updates**: Update imports in sidebar components to reference new paths (`/icons/sidebar/[icon-name]`)
- **No Build Changes**: Leverage Next.js automatic public folder serving

## Risks / Trade-offs

- **Broken References**: Risk of missing icon path updates in components → Mitigation: Comprehensive search for all icon references
- **Cache Issues**: Browser cache may serve old icon paths → Mitigation: Use cache-busting or force refresh during development
- **Future Conflicts**: Root directory cleanup may conflict with other team members → Mitigation: Coordinate change timing

## Migration Plan

1. Create `public/icons/sidebar/` directory
2. Move and rename icon files
3. Update component imports and references
4. Test sidebar navigation functionality
5. Remove old icon files from root

## Open Questions

- Are there any other components referencing these icons outside the main sidebar?
- Should we implement a centralized icon component for better maintainability?
