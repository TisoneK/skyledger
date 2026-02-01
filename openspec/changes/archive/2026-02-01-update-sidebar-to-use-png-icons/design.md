## Context

Currently, the sidebar navigation in `src/components/layout/main-layout.tsx` uses Lucide React icons (Wallet, TrendingUp, Users, Zap) for the different financial roles. Custom PNG icons have been created and organized in `public/icons/sidebar/` but are not being used. The application uses Next.js with TypeScript and follows a component-based architecture.

## Goals / Non-Goals

**Goals:**
- Replace Lucide React icons with custom PNG icons for better brand consistency
- Implement proper Image components with optimized loading and error handling
- Maintain responsive design and accessibility standards
- Ensure consistent sizing and alignment across all sidebar buttons

**Non-Goals:**
- Changing the overall sidebar layout or functionality
- Modifying the role switching logic
- Changing button behavior or interactions
- Altering the responsive breakpoints

## Decisions

- **Image Component Usage**: Use Next.js Image component instead of standard img tags for automatic optimization and lazy loading
- **Icon Mapping**: Create a mapping object to associate role names with their respective PNG icon paths
- **Sizing Strategy**: Use fixed width/height (24x24px) for consistency with current Lucide icon sizes
- **Error Handling**: Implement fallback to Lucide icons if PNG icons fail to load
- **Accessibility**: Maintain proper alt text and aria-hidden attributes for decorative icons

## Risks / Trade-offs

- **Loading Performance**: PNG icons are larger than SVG icons → Mitigation: Use Next.js Image optimization and proper sizing
- **Cache Issues**: Browser may cache old icons → Mitigation: Implement cache-busting strategy if needed
- **Error Fallbacks**: PNG icons might fail to load → Mitigation: Implement graceful fallback to Lucide icons
- **Responsive Scaling**: PNG icons may not scale as well as SVGs → Mitigation: Use multiple sizes if needed

## Migration Plan

1. Create icon mapping object with role-to-PNG-path associations
2. Update roleConfig array to use PNG icons instead of Lucide components
3. Import Next.js Image component and remove unused Lucide imports
4. Update sidebar button rendering to use Image components
5. Add error handling and fallback logic
6. Test responsive behavior and accessibility

## Open Questions

- Should we implement hover states for PNG icons?
- Do we need different icon sizes for different viewport breakpoints?
- Should we preload critical icons for better performance?
