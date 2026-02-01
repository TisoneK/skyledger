## Context

Currently, financial role icons are stored in `public/icons/sidebar/` directory, making them only accessible to sidebar components. The application has multiple components that need role-based visual representations including role performance cards, user profiles, and role selection interfaces. This siloed approach leads to code duplication and inconsistent role representation across the application.

## Goals / Non-Goals

**Goals:**
- Create a centralized, reusable role icon system accessible to all components
- Maintain backward compatibility during the transition
- Ensure consistent role representation across the application
- Optimize icon loading and caching performance

**Non-Goals:**
- Complete redesign of the icon system (only restructuring existing role icons)
- Changes to non-role icons or other asset categories
- Modifications to icon visual design or content

## Decisions

**Directory Structure**: Use `icons/roles/` instead of `icons/sidebar/`
- **Rationale**: Role icons represent financial roles, not sidebar functionality. This semantic naming makes the purpose clear and enables reuse.
- **Alternative**: Keep sidebar directory and create symlinks - rejected due to complexity and potential build issues.

**Component Integration**: Create a shared RoleIcon component
- **Rationale**: Centralizes icon loading logic, error handling, and optimization. Components can import `<RoleIcon type="personal" />` instead of managing paths directly.
- **Alternative**: Direct path imports - rejected due to maintenance overhead and inconsistent error handling.

**Migration Strategy**: Gradual path updates with fallback
- **Rationale**: Allows incremental migration without breaking existing functionality. Old paths redirect to new locations during transition.
- **Alternative**: Big bang migration - rejected due to high risk of broken references.

## Risks / Trade-offs

**Broken Icon References** → Implement comprehensive testing and automated path validation
**Performance Impact** → Use Next.js Image optimization and implement icon caching
**Build Complexity** → Update build scripts to handle new directory structure
**Team Coordination** → Clear documentation and migration timeline

## Migration Plan

1. Create new `icons/roles` directory structure
2. Move existing role icons to new location
3. Implement RoleIcon shared component
4. Update sidebar component to use new system
5. Update role performance cards and other components
6. Remove old sidebar icon directory
7. Update build processes and documentation

## Open Questions

- Should we implement icon lazy loading for performance?
- Do we need different icon sizes for different components?
- Should we add icon variants (e.g., active/inactive states)?
