# SkyLedger Brand Icon Feature Plan

## Feature Name: Custom Brand Icon Integration

## Current State
- Generic gradient placeholder icons are used throughout the application
- Custom SkyLedger icon (`icon.png`) exists in project root directory
- No organized asset structure for brand icons

## Proposed Feature
Replace placeholder icons with custom SkyLedger brand icon for consistent branding across the application.

## Implementation Plan

### 1. Asset Organization
- Create `public/assets/icons/` directory
- Move `icon.png` → `public/assets/icons/skyledger-icon.png`
- Establish proper asset structure for future brand assets

### 2. Component Development  
- Create reusable `SkyLedgerIcon` component in `src/components/ui/`
- Implement with Next.js Image optimization
- Add TypeScript props for size customization
- Ensure accessibility with proper alt text

### 3. UI Integration Points
- **Navigation Header**: Replace gradient icon with SkyLedgerIcon (32x32px)
- **Sidebar "All Roles"**: Replace gradient icon with SkyLedgerIcon (24x24px)
- Maintain consistent visual hierarchy and spacing

### 4. Technical Requirements
- Use Next.js Image component for optimization
- Implement responsive sizing
- Add proper loading states
- Ensure accessibility compliance
- Maintain performance standards

## Benefits
- Professional brand appearance
- Consistent visual identity
- Improved user recognition
- Scalable component-based approach
- Better performance with optimized loading

## Files to Modify
- `src/components/layout/main-layout.tsx` - Update icon references

## Files to Create
- `src/components/ui/skyledger-icon.tsx` - Icon component
- `public/assets/icons/skyledger-icon.png` - Moved icon asset

## Testing Requirements
- Visual verification in navigation header
- Visual verification in sidebar
- Responsive behavior testing
- Accessibility validation
- Performance impact assessment

## Timeline
This is a straightforward implementation that can be completed in a single development session.

## Dependencies
- None (self-contained feature)
- Existing icon asset available
- Next.js Image optimization already configured
