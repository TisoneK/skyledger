# Sidebar Icon Restructuring Issue

## Current Situation

The sidebar icons are currently located in `icons/sidebar` directory, but these icons represent financial roles rather than being specific to sidebar functionality. This creates a limitation where the same role icons cannot be easily reused by other components that need role-based visual representations.

## Problem Statement

- **Location**: Icons are stored in `icons/sidebar` directory
- **Content**: Icons represent financial roles (personal, chama, side-income, etc.)
- **Limitation**: Icons are siloed for sidebar use only and cannot be easily reused by other components
- **Impact**: Code duplication and inconsistent role representation across the application

## Proposed Solution

Restructure the icon directory to create a more reusable organization:

### New Directory Structure
```
icons/
├── roles/
│   ├── personal.png
│   ├── chama.png
│   ├── side-income.png
│   └── all-roles.png
├── sidebar/
│   └── (sidebar-specific icons if any)
└── (other icon categories as needed)
```

### Benefits of Restructuring

1. **Reusability**: Role icons can be used by multiple components
   - Sidebar navigation buttons
   - Role performance cards
   - User profile sections
   - Role selection interfaces

2. **Consistency**: Same role icons across all components
3. **Maintainability**: Single source of truth for role icons
4. **Scalability**: Easy to add new role-based components

## Implementation Requirements

After restructuring the icons, the following specification for code changes should be written:

### Code Change Specification Requirements

1. **Icon Path Updates**
   - Update all import statements referencing sidebar icons
   - Modify component props to use new icon paths
   - Update any hardcoded icon references

2. **Component Integration**
   - Sidebar component updates to use new icon paths
   - Role performance cards integration with role icons
   - Any other components that should use role icons

3. **Configuration Changes**
   - Update icon mapping configurations
   - Modify any icon registry or mapping files
   - Update build processes if icon paths are referenced

4. **Testing Requirements**
   - Verify all icons display correctly in sidebar
   - Test role icons in performance cards
   - Ensure no broken image references
   - Validate accessibility features remain intact

5. **Documentation Updates**
   - Update component documentation
   - Modify icon usage guidelines
   - Update development setup instructions
