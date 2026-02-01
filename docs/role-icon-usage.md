# RoleIcon Component Usage Guide

## Overview

The `RoleIcon` component provides a centralized, reusable way to display role-specific icons throughout the SkyLedger application. It supports custom PNG icons with fallback to Lucide icons for error handling.

## Features

- **Centralized icon management**: Single source of truth for role icons
- **Fallback handling**: Automatic fallback to Lucide icons if PNG fails to load
- **Accessibility**: Proper alt text and ARIA support
- **TypeScript support**: Full type safety with defined interfaces
- **Flexible sizing**: Configurable icon sizes with CSS class support

## Usage

### Basic Usage

```tsx
import { RoleIcon } from '@/components/ui/role-icon';

// Display a personal role icon
<RoleIcon type="personal" size={24} />

// Display a chama role icon with custom styling
<RoleIcon 
  type="chama" 
  size={16} 
  className="text-green-600" 
/>
```

### Available Role Types

- `personal` - Personal finance role
- `chama` - Group savings/contribution role  
- `side-income` - Additional income streams
- `sky-tech` - Business/Sky Tech role
- `all-roles` - Combined/all roles view

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `RoleType` | Required | The role type to display |
| `size` | `number` | `24` | Icon size in pixels |
| `className` | `string` | `''` | Additional CSS classes |
| `alt` | `string` | Auto-generated | Custom alt text for accessibility |
| `fallback` | `ReactNode` | Lucide icon | Custom fallback component |

### Examples

#### Sidebar Navigation

```tsx
<RoleIcon 
  type="all-roles"
  size={24}
  className={cn("h-6 w-6", selectedRole === 'all' && "text-green-600")}
/>
```

#### Performance Cards

```tsx
<RoleIcon 
  type={getRoleIconType(role.name)}
  size={16}
  className={cn("h-4 w-4", roleConfig.text)}
/>
```

#### With Custom Fallback

```tsx
<RoleIcon 
  type="personal"
  size={32}
  fallback={<CustomSpinner />}
/>
```

## Icon Paths

Icons are stored in `/public/icons/roles/` with the following naming convention:

- `personal.png`
- `chama.png` 
- `side-income.png`
- `sky-tech.png`
- `all-roles.png`

## Error Handling

The component automatically handles missing or failed-to-load icons:

1. Attempts to load the PNG icon from the specified path
2. If loading fails, displays the corresponding Lucide fallback icon
3. Supports custom fallback components via the `fallback` prop

## Accessibility

- Automatic alt text generation based on role type
- Support for custom alt text via `alt` prop
- Semantic HTML structure with proper ARIA attributes

## Migration from Old Icons

### Before (Old Approach)

```tsx
// Old hardcoded icon mapping
const iconMapping = {
  personal: '/icons/sidebar/personal.png',
  chama: '/icons/sidebar/chama.png',
  // ...
};

<img src={iconMapping[role]} alt={role} />
```

### After (RoleIcon)

```tsx
// New centralized approach
<RoleIcon type={role} size={24} />
```

## Styling

The component supports Tailwind CSS classes for styling:

```tsx
// Size classes
<RoleIcon type="personal" className="h-4 w-4" />
<RoleIcon type="chama" className="h-6 w-6" />

// Color classes  
<RoleIcon type="business" className="text-blue-600" />
<RoleIcon type="chama" className="text-green-500" />

// Combined styling
<RoleIcon 
  type="side-income" 
  size={20}
  className="h-5 w-5 text-purple-600 hover:text-purple-800" 
/>
```

## Best Practices

1. **Use semantic role types**: Always use the predefined `RoleType` values
2. **Provide consistent sizing**: Use standard sizes (16, 20, 24, 32px)
3. **Include color classes**: Apply appropriate text colors for different states
4. **Test fallbacks**: Ensure icons work when PNG files are missing
5. **Accessibility**: Use meaningful alt text when overriding defaults

## Troubleshooting

### Icons Not Displaying

1. Check that PNG files exist in `/public/icons/roles/`
2. Verify file names match the role type conventions
3. Check browser console for 404 errors

### Styling Issues

1. Remove conflicting size classes when using the `size` prop
2. Use `h-* w-*` classes for consistent sizing
3. Apply color classes to the component, not child elements

### TypeScript Errors

1. Import `RoleType` interface for type safety
2. Use proper role type values from the predefined union
3. Check that all required props are provided

## Future Enhancements

- Support for SVG icons
- Icon animation support
- Theme-aware icon variants
- Icon lazy loading optimization
