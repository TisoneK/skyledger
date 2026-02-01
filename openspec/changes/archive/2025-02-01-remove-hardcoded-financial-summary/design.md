## Context

The main page currently displays financial summary cards at the very top of the dashboard, creating immediate visual clutter before users can engage with the primary dashboard content. These cards occupy prominent screen real estate and compete visually with more important dashboard components like WeeklySnapshot and transaction entry tools.

## Goals / Non-Goals

**Goals:**
- Remove visual clutter from the top of the main dashboard
- Create better visual hierarchy and information architecture
- Free up screen real estate for more important dashboard content
- Improve overall user experience and design aesthetics
- Allow users to focus on primary dashboard functionality first

**Non-Goals:**
- Remove the financial data permanently (it could be relocated later)
- Modify other dashboard components or their functionality
- Create new components to replace the financial summary
- Change the overall dashboard structure beyond the top section

## Decisions

**Top Section Removal**: Remove the entire financial summary section from the top rather than relocating it
- **Rationale**: Creates immediate visual impact and simplifies the layout
- **Alternative considered**: Moving to sidebar - rejected as it would still compete for attention

**Preserve Component Structure**: Keep all existing dashboard components intact below the removed section
- **Rationale**: Maintains all existing functionality while improving layout
- **Alternative considered**: Major restructuring - rejected as unnecessary complexity

**No Placeholder Needed**: Leave the space empty rather than adding placeholder content
- **Rationale**: Clean, minimalist approach allows other components to breathe
- **Alternative considered**: Adding welcome message - rejected as unnecessary chrome

## Risks / Trade-offs

**[Risk]** Users may miss quick financial overview → **Mitigation**: Other components provide financial insights in context
**[Risk]** Layout may appear sparse initially → **Mitigation**: Clean design is better than cluttered design
**[Trade-off]** Less information at first glance → **Accept**: Better focus on primary tasks outweighs quick stats

## Migration Plan

1. Remove the financial summary grid section from src/app/page.tsx (lines 28-53)
2. Test that remaining components fill the space appropriately
3. Verify responsive layout works well on different screen sizes
4. **Rollback Strategy**: Git history allows easy restoration if needed

## Open Questions

- Should we consider adding the financial summary back in a less prominent location later?
- Will users prefer the cleaner layout or request the return of quick stats?
