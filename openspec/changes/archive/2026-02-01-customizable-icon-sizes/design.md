## Context

The current RoleIcon component uses hardcoded size values that lead to inconsistent sizing across components. Sidebar icons use 24px while performance card icons use 16px, creating visual hierarchy issues. The existing component lacks a centralized sizing system, making it difficult to maintain consistent icon sizes or make global adjustments.

Current implementation requires manual size specification in each component:
```tsx
<RoleIcon type="personal" size={24} className="h-6 w-6" /> // Sidebar
<RoleIcon type="personal" size={16} className="h-4 w-4" /> // Cards
```

This approach creates maintenance overhead and risks inconsistent sizing as new components are added.

## Goals / Non-Goals

**Goals:**
- Create a centralized icon size configuration system that ensures consistency
- Enable automatic contextual sizing based on UI context
- Provide global size customization that affects all components
- Maintain backward compatibility with existing size prop usage
- Support responsive sizing for different screen sizes
- Ensure accessibility compliance with high contrast and reduced motion

**Non-Goals:**
- Complete redesign of the RoleIcon component architecture
- Breaking changes to existing component APIs
- New icon rendering system or image optimization changes
- Dynamic icon loading or caching improvements

## Decisions

### 1. Configuration-Driven Size Management

**Decision:** Use a centralized configuration object with predefined size presets rather than component-level size constants.

**Rationale:** 
- Single source of truth for icon sizes
- Easy global adjustments and theme support
- Consistent sizing across all components
- Simple to extend with new contexts

**Alternatives considered:**
- CSS custom properties: More complex to integrate with Tailwind
- Component-level constants: Doesn't solve global consistency
- Theme provider integration: Over-engineering for current needs

### 2. Context-Based Automatic Sizing

**Decision:** Implement automatic context detection using CSS class patterns and component hierarchy.

**Rationale:**
- Reduces boilerplate code in components
- Maintains explicit override capability
- Leverages existing Tailwind class patterns
- Provides intuitive developer experience

**Implementation approach:**
```tsx
// Automatic context detection
<RoleIcon type="personal" /> // Detects from parent classes

// Manual context specification  
<RoleIcon type="personal" context="sidebar" />

// Explicit size override (backward compatibility)
<RoleIcon type="personal" size={24} />
```

### 3. Tailwind CSS Integration Strategy

**Decision:** Generate Tailwind classes dynamically based on size configuration rather than using inline styles.

**Rationale:**
- Maintains consistency with existing styling approach
- Enables responsive design utilities
- Supports hover and focus states
- Better performance than inline styles

**Class generation pattern:**
```tsx
// Size: 20px → Classes: "h-5 w-5"
// Size: 24px → Classes: "h-6 w-6" 
// Size: 16px → Classes: "h-4 w-4"
```

### 4. TypeScript Interface Design

**Decision:** Extend existing RoleIconProps interface rather than creating new component.

**Rationale:**
- Maintains backward compatibility
- Minimal API surface area
- Clear migration path for existing code
- TypeScript IntelliSense support

**Interface design:**
```tsx
interface RoleIconProps {
  type: RoleType;
  size?: number;           // Backward compatibility
  context?: IconContext;   // New: sidebar, card, compact, large
  className?: string;
  alt?: string;
  fallback?: React.ReactNode;
}
```

### 5. Configuration File Location

**Decision:** Store size configuration in `/lib/icon-sizes.ts` rather than component directory.

**Rationale:**
- Shared utility location accessible by all components
- Easy to import and modify
- Separation of concerns from UI components
- Supports future theme integration

## Risks / Trade-offs

### Performance Risk
**Risk:** Dynamic class generation could impact rendering performance.
**Mitigation:** Cache generated classes and use memoization for size lookups.

### Backward Compatibility Risk  
**Risk:** Existing components might break with new sizing logic.
**Mitigation:** Maintain full backward compatibility with existing `size` prop usage.

### CSS Conflict Risk
**Risk:** Generated Tailwind classes might conflict with existing styles.
**Mitigation:** Use standard Tailwind size classes that are already well-tested.

### Migration Complexity Risk
**Risk:** Developers may find the new system confusing during migration.
**Mitigation:** Provide comprehensive documentation and migration guide with clear examples.

## Migration Plan

### Phase 1: Core Implementation
1. Create icon size configuration system
2. Update RoleIcon component with new props
3. Implement context detection logic
4. Add comprehensive unit tests

### Phase 2: Component Updates
1. Update sidebar components to use context-based sizing
2. Update performance card components
3. Verify visual consistency across all components
4. Add integration tests

### Phase 3: Documentation and Migration
1. Update component documentation
2. Create migration guide for developers
3. Add examples and best practices
4. Update design system documentation

### Rollback Strategy
- Maintain backward compatibility with existing `size` prop
- Feature flag for new context-based sizing
- Gradual rollout allows monitoring and quick rollback if issues arise

## Open Questions

1. **Responsive Breakpoints:** Should different size presets be used for mobile vs desktop, or should we use responsive Tailwind classes?

2. **Animation Timing:** What transition duration should be used for size changes to feel smooth but not distracting?

3. **Context Detection Granularity:** How specific should context detection be? Should we detect specific component types or general UI patterns?

4. **Global Customization API:** Should developers be able to customize sizes at runtime, or only at build time through configuration?

5. **Theme Integration:** How should this integrate with potential future theme systems? Should size presets be theme-aware?
