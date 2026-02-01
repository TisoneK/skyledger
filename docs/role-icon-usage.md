# RoleIcon Component Usage Guide

## Overview

The `RoleIcon` component provides a centralized, reusable way to display role-specific icons throughout the SkyLedger application. It supports custom PNG icons with fallback to Lucide icons for error handling and now includes **configurable sizing** with context-based automatic sizing.

## Features

- **Centralized icon management**: Single source of truth for role icons
- **Configurable sizing**: Context-based automatic sizing with global customization
- **Fallback handling**: Automatic fallback to Lucide icons if PNG fails to load
- **Accessibility**: Proper alt text, ARIA support, and high contrast mode adjustments
- **TypeScript support**: Full type safety with defined interfaces
- **Responsive design**: Mobile-optimized sizing with breakpoint support
- **Backward compatibility**: Existing `size` prop continues to work

## Usage

### Basic Usage

```tsx
import { RoleIcon } from '@/components/ui/role-icon';

// Display a personal role icon
<RoleIcon type="personal" />

// Display a chama role icon with custom styling
<RoleIcon 
  type="chama" 
  className="text-green-600" 
/>
```

### Context-Based Sizing (Recommended)

The new system automatically applies appropriate sizes based on UI context:

```tsx
// Automatic context detection from CSS classes
<RoleIcon type="personal" className="sidebar" />  // 24px
<RoleIcon type="personal" className="card" />     // 20px
<RoleIcon type="personal" className="compact" />  // 16px
<RoleIcon type="personal" className="large" />    // 32px

// Explicit context specification
<RoleIcon type="personal" context="sidebar" />  // 24px
<RoleIcon type="personal" context="card" />     // 20px
<RoleIcon type="personal" context="compact" />  // 16px
<RoleIcon type="personal" context="large" />    // 32px
```

### Available Role Types

- `personal` - Personal finance role
- `chama` - Group savings/contribution role  
- `side-income` - Additional income streams
- `sky-tech` - Business/Sky Tech role
- `all-roles` - Combined/all roles view

### Available Contexts

- `sidebar` - Navigation and main UI elements (24px)
- `card` - Performance cards and content areas (20px)
- `compact` - Tight spaces and minimal UI (16px)
- `large` - Featured elements and accessibility (32px)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `RoleType` | Required | The role type to display |
| `size` | `number` | - | **Backward compatibility**: Explicit size in pixels |
| `context` | `IconContext` | - | **New**: UI context for automatic sizing |
| `className` | `string` | `''` | Additional CSS classes |
| `alt` | `string` | Auto-generated | Custom alt text for accessibility |
| `fallback` | `ReactNode` | Lucide icon | Custom fallback component |
| `responsive` | `boolean` | `false` | Enable responsive sizing adjustments |

### Examples

#### Sidebar Navigation

```tsx
<RoleIcon 
  type="all-roles"
  context="sidebar"
  className={selectedRole === 'all' && "text-green-600"}
/>
```

#### Performance Cards

```tsx
<RoleIcon 
  type={getRoleIconType(role.name)}
  context="card"
  className={roleConfig.text}
/>
```

#### Responsive Icons

```tsx
<RoleIcon 
  type="personal"
  context="sidebar"
  responsive={true} // Adjusts size for mobile/desktop
/>
```

#### Backward Compatibility

```tsx
// Old way still works
<RoleIcon type="personal" size={24} className="h-6 w-6" />

// New way (recommended)
<RoleIcon type="personal" context="sidebar" />
```

#### With Custom Fallback

```tsx
<RoleIcon 
  type="personal"
  context="card"
  fallback={<CustomSpinner />}
/>
```

## Configuration System

### Global Size Customization

```tsx
import { updateIconSizeConfiguration, scaleIconSizes } from '@/lib/icon-sizes';

// Scale all icons by 20%
scaleIconSizes(1.2);

// Update specific context sizes
updateIconSizeConfiguration({
  sizes: {
    sidebar: 28,  // Make sidebar icons larger
    card: 22,     // Slightly larger card icons
  }
});

// Disable accessibility adjustments
updateIconSizeConfiguration({
  accessibility: {
    enableHighContrastAdjustment: false,
    enableReducedMotion: false,
  }
});
```

### Size Configuration API

```tsx
import { 
  getIconSize, 
  getAvailableContexts,
  resetIconSizeConfiguration 
} from '@/lib/icon-sizes';

// Get current size for a context
const sidebarSize = getIconSize('sidebar'); // 24

// Get all available contexts
const contexts = getAvailableContexts(); 
// ['sidebar', 'card', 'compact', 'large']

// Reset to defaults
resetIconSizeConfiguration();
```

### Default Size Presets

```tsx
const defaultSizes = {
  sidebar: 24,    // Navigation elements
  card: 20,       // Performance cards
  compact: 16,    // Tight spaces
  large: 32,      // Featured elements
};
```

## Responsive Design

The system supports automatic responsive sizing:

```tsx
// Mobile-optimized sizes
const mobileSizes = {
  compact: 14,    // Smaller on mobile
  card: 18,       // Slightly smaller cards
};

// Desktop-optimized sizes  
const desktopSizes = {
  large: 36,      // Larger on desktop
};
```

## Accessibility Features

### High Contrast Mode

Automatically increases icon sizes by 25% when high contrast mode is detected:

```tsx
// High contrast mode automatically applied
// 24px → 30px, 20px → 25px, etc.
```

### Reduced Motion

Disables transition animations when reduced motion is preferred:

```tsx
// Transitions automatically disabled for users who prefer reduced motion
```

### Screen Reader Support

Maintains proper alt text and ARIA attributes for screen reader compatibility.

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

## Styling

The component supports Tailwind CSS classes for styling:

```tsx
// Size classes (automatically applied by context)
<RoleIcon type="personal" context="sidebar" />

// Color classes  
<RoleIcon type="business" className="text-blue-600" />
<RoleIcon type="chama" className="text-green-500" />

// Combined styling
<RoleIcon 
  type="side-income" 
  context="card"
  className="text-purple-600 hover:text-purple-800" 
/>
```

## Migration Guide

### From Hardcoded Sizes

**Before:**
```tsx
<RoleIcon type="personal" size={24} className="h-6 w-6" />
<RoleIcon type="personal" size={16} className="h-4 w-4" />
```

**After:**
```tsx
<RoleIcon type="personal" context="sidebar" />
<RoleIcon type="personal" context="card" />
```

### Benefits of Migration

- **Consistency**: All icons use the same sizing system
- **Maintainability**: Single source of truth for icon sizes
- **Accessibility**: Automatic high contrast and reduced motion support
- **Responsive**: Built-in mobile/desktop optimization
- **Customization**: Easy global size adjustments

## Best Practices

1. **Use context-based sizing**: Prefer `context` prop over explicit `size`
2. **Add semantic class names**: Use `sidebar`, `card`, `compact`, `large` classes for auto-detection
3. **Test accessibility**: Verify icons work with screen readers and high contrast mode
4. **Consider responsive users**: Enable `responsive` prop for mobile optimization
5. **Customize globally**: Use configuration API instead of per-component size overrides

## Troubleshooting

### Icons Not Displaying

1. Check that PNG files exist in `/public/icons/roles/`
2. Verify file names match the role type conventions
3. Check browser console for 404 errors

### Styling Issues

1. Remove conflicting size classes when using `context` prop
2. Use semantic class names for auto-detection
3. Apply color classes to the component, not child elements

### TypeScript Errors

1. Import `IconContext` type for type safety
2. Use proper role type values from the predefined union
3. Check that all required props are provided

### Size Not Applying

1. Ensure context name matches available contexts
2. Check if accessibility settings are affecting size
3. Verify global configuration hasn't been modified

## Performance Considerations

- **Class Caching**: CSS classes are cached to avoid repeated calculations
- **Memoization**: Size lookups are optimized for performance
- **Lazy Loading**: Icons load only when needed
- **Bundle Size**: Minimal impact on bundle size with tree-shaking
