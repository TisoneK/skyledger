# Icon Sizing Migration Guide

## Overview

This guide helps you migrate from hardcoded icon sizes to the new configurable icon sizing system. The new system provides centralized size management, automatic context-based sizing, and accessibility features.

## What's Changing

### Before (Hardcoded Sizes)

```tsx
// Sidebar icons
<RoleIcon type="personal" size={24} className="h-6 w-6" />
<RoleIcon type="chama" size={24} className="h-6 w-6" />

// Performance card icons  
<RoleIcon type="personal" size={16} className="h-4 w-4" />
<RoleIcon type="chama" size={16} className="h-4 w-4" />
```

### After (Configurable Sizing)

```tsx
// Automatic context detection
<RoleIcon type="personal" className="sidebar" />  // 24px
<RoleIcon type="personal" className="card" />     // 20px

// Explicit context specification
<RoleIcon type="personal" context="sidebar" />  // 24px
<RoleIcon type="personal" context="card" />     // 20px
```

## Migration Steps

### Step 1: Update Component Imports

No changes needed - the `RoleIcon` component import remains the same:

```tsx
import { RoleIcon } from '@/components/ui/role-icon';
```

### Step 2: Replace Size Props with Context

**Find all instances of:**
```tsx
<RoleIcon type="..." size={24} className="h-6 w-6" />
<RoleIcon type="..." size={16} className="h-4 w-4" />
```

**Replace with:**
```tsx
<RoleIcon type="..." context="sidebar" />
<RoleIcon type="..." context="card" />
```

### Step 3: Update CSS Classes

**Remove hardcoded size classes:**
```tsx
// Before
<RoleIcon type="personal" size={24} className="h-6 w-6 text-blue-600" />

// After  
<RoleIcon type="personal" context="sidebar" className="text-blue-600" />
```

### Step 4: Add Context Classes for Auto-Detection

**Add semantic class names to enable automatic context detection:**

```tsx
// Sidebar components
<div className="sidebar-nav">
  <RoleIcon type="personal" className="sidebar" />
</div>

// Card components
<div className="performance-card">
  <RoleIcon type="personal" className="card" />
</div>

// Compact areas
<div className="compact-list">
  <RoleIcon type="personal" className="compact" />
</div>

// Featured elements
<div className="featured-section">
  <RoleIcon type="personal" className="large" />
</div>
```

## File-by-File Migration

### 1. Main Layout (`src/components/layout/main-layout.tsx`)

**Before:**
```tsx
<RoleIcon 
  type="all-roles"
  size={24}
  className={cn("h-6 w-6", selectedRole === 'all' && "text-green-600")}
/>

<RoleIcon 
  type={role.name as any}
  size={24}
  className={cn("h-6 w-6", selectedRole === role.name && role.color)}
/>
```

**After:**
```tsx
<RoleIcon 
  type="all-roles"
  context="sidebar"
  className={cn("sidebar", selectedRole === 'all' && "text-green-600")}
/>

<RoleIcon 
  type={role.name as any}
  context="sidebar"
  className={cn("sidebar", selectedRole === role.name && role.color)}
/>
```

### 2. Weekly Snapshot (`src/components/dashboard/weekly-snapshot.tsx`)

**Before:**
```tsx
<RoleIcon 
  type={getRoleIconType(role.name)}
  size={16}
  className={cn("h-4 w-4", roleConfig.text)}
/>
```

**After:**
```tsx
<RoleIcon 
  type={getRoleIconType(role.name)}
  context="card"
  className={cn("card", roleConfig.text)}
/>
```

### 3. Week-over-Week Comparison (`src/components/dashboard/week-over-week-comparison.tsx`)

**Before:**
```tsx
<RoleIcon 
  type={getRoleIconType(roleId)}
  size={16}
  className="h-4 w-4"
/>
```

**After:**
```tsx
<RoleIcon 
  type={getRoleIconType(roleId)}
  context="card"
  className="card"
/>
```

## Context Mapping

| Old Size | New Context | Use Case |
|----------|-------------|---------|
| 24px | `sidebar` | Navigation, main UI elements |
| 20px | `card` | Performance cards, content areas |
| 16px | `compact` | Tight spaces, minimal UI |
| 32px | `large` | Featured elements, accessibility |

## Advanced Features

### Responsive Sizing

Enable responsive adjustments for mobile/desktop:

```tsx
<RoleIcon 
  type="personal" 
  context="sidebar" 
  responsive={true} // Automatically adjusts for screen size
/>
```

### Global Customization

Scale all icons globally:

```tsx
import { scaleIconSizes } from '@/lib/icon-sizes';

// Make all icons 20% larger
scaleIconSizes(1.2);
```

Update specific context sizes:

```tsx
import { updateIconSizeConfiguration } from '@/lib/icon-sizes';

updateIconSizeConfiguration({
  sizes: {
    sidebar: 28,  // Larger sidebar icons
    card: 22,     // Larger card icons
  }
});
```

## Validation Checklist

### ✅ Visual Testing

- [ ] Sidebar icons display correctly (24px)
- [ ] Performance card icons display correctly (20px)
- [ ] Icons scale properly on different screen sizes
- [ ] Hover states work as expected
- [ ] Color classes apply correctly

### ✅ Functionality Testing

- [ ] Context auto-detection works from CSS classes
- [ ] Explicit context specification works
- [ ] Backward compatibility with `size` prop
- [ ] Fallback icons display when PNG files are missing
- [ ] Accessibility adjustments apply in high contrast mode

### ✅ Code Quality

- [ ] No hardcoded size values remain
- [ ] Semantic class names are used
- [ ] TypeScript types are correct
- [ ] No console errors

## Common Issues and Solutions

### Issue: Icons appear too small

**Cause:** Using old `size` prop without context-based sizing

**Solution:**
```tsx
// Instead of:
<RoleIcon type="personal" size={16} />

// Use:
<RoleIcon type="personal" context="card" />
```

### Issue: Inconsistent icon sizes

**Cause:** Mixed usage of old and new approaches

**Solution:** Ensure all icons use context-based sizing:
```tsx
// Consistent approach
<RoleIcon type="personal" context="sidebar" />
<RoleIcon type="chama" context="sidebar" />
<RoleIcon type="business" context="card" />
```

### Issue: CSS classes not applying

**Cause:** Conflicting size classes with context-based sizing

**Solution:** Remove hardcoded size classes:
```tsx
// Instead of:
<RoleIcon type="personal" context="sidebar" className="h-6 w-6" />

// Use:
<RoleIcon type="personal" context="sidebar" className="text-blue-600" />
```

### Issue: TypeScript errors

**Cause:** Missing type imports or incorrect prop usage

**Solution:**
```tsx
import { RoleIcon, type IconContext } from '@/components/ui/role-icon';

const context: IconContext = 'sidebar';
<RoleIcon type="personal" context={context} />
```

## Rollback Plan

If you encounter issues during migration, you can easily rollback:

### Temporary Rollback

Keep the old `size` prop usage alongside the new approach:

```tsx
// Mixed approach during migration
<RoleIcon type="personal" size={24} className="h-6 w-6" /> // Old way
<RoleIcon type="chama" context="sidebar" /> // New way
```

### Complete Rollback

Remove context prop and restore size props:

```tsx
// Complete rollback
<RoleIcon type="personal" size={24} className="h-6 w-6" />
<RoleIcon type="chama" size={16} className="h-4 w-4" />
```

## Benefits of Migration

### ✅ Consistency
- All icons use the same sizing system
- No more scattered size values
- Single source of truth for icon dimensions

### ✅ Maintainability  
- Easy to adjust sizes globally
- Centralized configuration management
- Clear separation of concerns

### ✅ Accessibility
- Automatic high contrast mode support
- Reduced motion preferences respected
- Screen reader compatibility maintained

### ✅ Extensibility
- Easy to add new contexts
- Simple to customize per-theme
- Responsive design built-in

## Support

If you encounter issues during migration:

1. **Check the console** for any error messages
2. **Verify file paths** - ensure icons exist in `/public/icons/roles/`
3. **Test incrementally** - migrate one component at a time
4. **Use browser dev tools** - inspect icon elements to verify applied sizes

## Next Steps

After completing the migration:

1. **Test thoroughly** across different screen sizes and browsers
2. **Customize globally** if needed using the configuration API
3. **Update documentation** for your team
4. **Consider responsive design** for mobile optimization
5. **Monitor performance** to ensure no regressions

The new icon sizing system provides a solid foundation for consistent, accessible, and maintainable icon management across your application.
