# Navigation Header Enhancement Specification

## Overview

Move the main title and theme toggle from the dashboard page to the navigation header for better UX and consistent branding throughout the application.

## Current State Analysis

### Navigation Header (`main-layout.tsx`)
- **Location**: Lines 102-138
- **Current Title**: Simple "SkyLedger" text with gradient icon
- **Right Side**: Sync status display only
- **Mobile**: Has hamburger menu button

### Dashboard Page Header (`page.tsx`)
- **Location**: Lines 28-34
- **Current Title**: "SkyLedger" + "Your weekly financial mirror" subtitle
- **Right Side**: Theme toggle component
- **Title Color**: Green (`text-green-600`)

## Proposed Changes

### 1. Navigation Header Updates

#### Title Enhancement
**Current** (Line 117):
```tsx
<span className="font-bold text-lg">SkyLedger</span>
```

**New**:
```tsx
<div>
  <h1 className="text-xl font-bold text-green-600">SkyLedger</h1>
  <p className="text-sm text-muted-foreground hidden sm:block">Your weekly financial mirror</p>
</div>
```

#### Theme Toggle Integration
**Add to sync status area** (Line 121):
```tsx
{/* Sync Status */}
<div className="ml-auto flex items-center space-x-2">
  <ThemeToggle />
  <div className={cn("flex items-center space-x-1 text-sm", getSyncStatusColor())}>
    {/* existing sync status content */}
  </div>
</div>
```

#### Responsive Considerations
- Hide subtitle on mobile (`hidden sm:block`)
- Maintain mobile menu button visibility
- Ensure proper spacing with theme toggle

### 2. Dashboard Page Cleanup

**Remove entire header section** (Lines 27-34):
```tsx
{/* REMOVE THIS ENTIRE SECTION */}
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold text-green-600">SkyLedger</h1>
    <p className="text-muted-foreground">Your weekly financial mirror</p>
  </div>
  <ThemeToggle />
</div>
```

## Technical Requirements

### Navigation Header Structure
```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-14 items-center">
    {/* Mobile menu button - unchanged */}
    
    {/* Enhanced Logo/Title */}
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-purple-600" />
      <div>
        <h1 className="text-xl font-bold text-green-600">SkyLedger</h1>
        <p className="text-sm text-muted-foreground hidden sm:block">Your weekly financial mirror</p>
      </div>
    </div>

    {/* Right side with theme toggle and sync status */}
    <div className="ml-auto flex items-center space-x-2">
      <ThemeToggle />
      <div className={cn("flex items-center space-x-1 text-sm", getSyncStatusColor())}>
        {/* existing sync status */}
      </div>
    </div>
  </div>
</header>
```

### Import Requirements
Add to `main-layout.tsx`:
```tsx
import { ThemeToggle } from '@/components/theme-toggle';
```

### Dashboard Page Structure
Remove the header section and keep the content starting from Quick Stats:
```tsx
return (
  <ThemeProvider>
    <KeyboardNav>
      <MainLayout>
        <div className="space-y-6">
          {/* Header removed - start with Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Stats Cards */}
          </div>
          
          {/* Rest of dashboard content */}
        </div>
      </MainLayout>
    </KeyboardNav>
  </ThemeProvider>
);
```

## Design Specifications

### Typography
- **Main Title**: `text-xl font-bold text-green-600`
- **Subtitle**: `text-sm text-muted-foreground`
- **Mobile**: Subtitle hidden on screens smaller than `sm`

### Spacing
- **Title Container**: `space-x-2` between icon and text
- **Right Side**: `space-x-2` between theme toggle and sync status
- **Header Height**: Maintain `h-14` (56px)

### Responsive Behavior
- **Mobile (<640px)**: Hide subtitle, keep title and theme toggle
- **Tablet/Desktop (≥640px)**: Show full title with subtitle
- **All sizes**: Maintain sync status visibility

### Theme Toggle Positioning
- **Placement**: Left of sync status
- **Spacing**: Proper visual separation from sync status
- **Accessibility**: Maintain existing ARIA labels and functionality

## Benefits

1. **Consistent Branding**: Title visible on all pages, not just dashboard
2. **Better UX**: Theme toggle accessible from any page
3. **Clean Dashboard**: More space for content without redundant header
4. **Professional Layout**: Navigation header serves as true app header
5. **Mobile Friendly**: Responsive subtitle hiding

## Implementation Notes

- **No Breaking Changes**: Existing functionality preserved
- **Backward Compatible**: Theme toggle and sync status work as before
- **Performance**: Minimal DOM changes, better component organization
- **Accessibility**: Screen readers get consistent header structure

## Testing Checklist

- [ ] Title displays correctly in navigation header
- [ ] Subtitle shows/hides responsively
- [ ] Theme toggle functions properly in new position
- [ ] Sync status remains functional
- [ ] Mobile menu button unaffected
- [ ] Dashboard page loads without header section
- [ ] All pages have consistent branding
- [ ] Theme switching works across all pages
- [ ] Responsive behavior tested on mobile/tablet/desktop
- [ ] Accessibility validation with screen readers
