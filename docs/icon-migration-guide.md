# Icon Migration Guide: From Hardcoded Icons to RoleIcon Component

## Overview

This guide helps developers migrate from hardcoded role icons to the new centralized `RoleIcon` component system.

## What Changed

### Before (Old System)

Icons were scattered across components with hardcoded paths and mappings:

```tsx
// Old approach in multiple components
const iconMapping = {
  personal: '/icons/sidebar/personal.png',
  chama: '/icons/sidebar/chama.png',
  business: '/icons/sidebar/business.png',
  sideincome: '/icons/sidebar/side-income.png',
};

const getRoleIcon = (roleId: string) => {
  switch (roleId) {
    case 'personal': return <DollarSign className="h-4 w-4" />;
    case 'chama': return <PiggyBank className="h-4 w-4" />;
    // ... more cases
  }
};
```

### After (New System)

Centralized icon management with the `RoleIcon` component:

```tsx
// New unified approach
import { RoleIcon } from '@/components/ui/role-icon';

<RoleIcon type="personal" size={24} className="text-blue-600" />
```

## Migration Steps

### 1. Update Imports

Replace old icon imports:

```tsx
// Remove these imports
import { DollarSign, PiggyBank, TrendingUp, Briefcase } from 'lucide-react';

// Add this import
import { RoleIcon } from '@/components/ui/role-icon';
```

### 2. Replace Icon Functions/Objects

**Old:**
```tsx
const iconMapping = {
  personal: '/icons/sidebar/personal.png',
  chama: '/icons/sidebar/chama.png',
  // ...
};

const CustomIcon = ({ roleName, size, className }) => {
  const iconPath = iconMapping[roleName];
  return <img src={iconPath} className={className} />;
};
```

**New:**
```tsx
// Simply use RoleIcon directly
<RoleIcon type={roleName} size={size} className={className} />
```

### 3. Update Role Name Mapping

The new system uses standardized role types:

| Old Role Name | New Role Type |
|---------------|---------------|
| `personal` | `personal` |
| `business` | `sky-tech` |
| `chama` | `chama` |
| `sideincome` | `side-income` |
| `all` | `all-roles` |

**Example mapping function:**
```tsx
const getRoleIconType = (roleName: string) => {
  switch (roleName) {
    case 'personal': return 'personal';
    case 'business': return 'sky-tech';
    case 'chama': return 'chama';
    case 'sideincome': return 'side-income';
    default: return 'personal';
  }
};
```

### 4. Update Component Usage

**Sidebar Example:**

**Before:**
```tsx
<Button>
  <CustomIcon 
    roleName="personal" 
    size={24}
    className="h-6 w-6" 
  />
  <span>Personal</span>
</Button>
```

**After:**
```tsx
<Button>
  <RoleIcon 
    type="personal"
    size={24}
    className="h-6 w-6" 
  />
  <span>Personal</span>
</Button>
```

**Performance Card Example:**

**Before:**
```tsx
const getRoleIcon = (roleId: string) => {
  switch (roleId) {
    case 'personal': return <DollarSign className="h-4 w-4" />;
    case 'chama': return <PiggyBank className="h-4 w-4" />;
    // ...
  }
};

<Card>
  <div className="flex items-center space-x-2">
    {getRoleIcon(role.id)}
    <span>{role.name}</span>
  </div>
</Card>
```

**After:**
```tsx
<Card>
  <div className="flex items-center space-x-2">
    <RoleIcon 
      type={getRoleIconType(role.id)}
      size={16}
      className="h-4 w-4" 
    />
    <span>{role.name}</span>
  </div>
</Card>
```

## File Structure Changes

### Old Structure
```
public/
└── icons/
    └── sidebar/
        ├── personal.png
        ├── chama.png
        ├── business.png
        └── side-income.png
```

### New Structure
```
public/
└── icons/
    └── roles/
        ├── personal.png
        ├── chama.png
        ├── sky-tech.png
        ├── side-income.png
        └── all-roles.png
```

## Component-Specific Migrations

### 1. Main Layout Sidebar

**File:** `src/components/layout/main-layout.tsx`

**Changes:**
- Remove `iconMapping` object
- Remove `CustomIcon` component
- Remove `fallbackIcons` mapping
- Update sidebar items to use `<RoleIcon>`

### 2. Weekly Snapshot

**File:** `src/components/dashboard/weekly-snapshot.tsx`

**Changes:**
- Update `RoleSummaryCard` component
- Remove hardcoded Lucide icon switch statement
- Use `<RoleIcon>` with proper type mapping

### 3. Week-over-Week Comparison

**File:** `src/components/dashboard/week-over-week-comparison.tsx`

**Changes:**
- Update `getRoleIcon` function
- Replace switch statement with `<RoleIcon>`

## Benefits of Migration

1. **Consistency**: All role icons use the same component
2. **Maintainability**: Single source of truth for icon logic
3. **Error Handling**: Automatic fallback to Lucide icons
4. **Accessibility**: Built-in alt text and ARIA support
5. **Type Safety**: Full TypeScript support
6. **Performance**: Optimized image loading

## Common Migration Issues

### Issue 1: Missing Icon Files

**Problem:** Icons not displaying after migration

**Solution:** 
1. Ensure PNG files exist in `/public/icons/roles/`
2. Check file names match the role type conventions
3. Verify file permissions

### Issue 2: Styling Conflicts

**Problem:** Icons not sized correctly

**Solution:**
```tsx
// Correct approach
<RoleIcon 
  type="personal" 
  size={24}
  className="h-6 w-6 text-blue-600" 
/>

// Avoid conflicting size props
<RoleIcon 
  type="personal" 
  size={16} // Use either size prop OR h-* w-* classes, not both
  className="text-blue-600" 
/>
```

### Issue 3: TypeScript Errors

**Problem:** Type errors with role types

**Solution:**
```tsx
import { RoleIcon, type RoleType } from '@/components/ui/role-icon';

const roleType: RoleType = 'personal'; // Use predefined types
<RoleIcon type={roleType} size={24} />
```

## Testing Your Migration

1. **Visual Check**: Ensure icons display correctly in all components
2. **Error Handling**: Test with missing icon files to verify fallbacks
3. **Accessibility**: Check alt text and screen reader compatibility
4. **Responsive**: Test icons at different sizes
5. **Browser Compatibility**: Test across different browsers

## Rollback Plan

If you need to rollback:

1. Restore icon files to `/public/icons/sidebar/`
2. Revert component changes to use old icon mappings
3. Restore `CustomIcon` component and related imports
4. Update any role name mappings back to original values

## Getting Help

- **Documentation**: See [RoleIcon Usage Guide](role-icon-usage.md)
- **Component Reference**: Check `src/components/ui/role-icon.tsx`
- **Examples**: Look at migrated components in the codebase
- **Issues**: Create a GitHub issue for migration problems

## Validation Checklist

- [ ] All hardcoded icon paths removed
- [ ] Components import and use `RoleIcon`
- [ ] Role name mappings updated correctly
- [ ] Icon files moved to `/public/icons/roles/`
- [ ] Styling applied correctly
- [ ] Fallback icons working
- [ ] Accessibility attributes present
- [ ] TypeScript errors resolved
- [ ] Visual testing completed
- [ ] Cross-browser testing done

---

**Note**: This migration improves code maintainability and provides a better foundation for future icon-related features.
