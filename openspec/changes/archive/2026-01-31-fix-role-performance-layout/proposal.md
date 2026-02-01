## Why

The Role Performance section on desktop view currently displays all role items in a single row, causing content compression that makes key metrics, KPIs, and insights difficult to read. This layout issue reduces readability and usability, especially when multiple roles with detailed performance data are displayed simultaneously.

## What Changes

- Implement a responsive grid layout for the Role Performance section that adapts to available screen width
- Add proper spacing and sizing for role performance cards
- Ensure key metrics and KPIs remain readable without compression
- Maintain responsive behavior across different desktop viewport sizes

## Capabilities

### New Capabilities
- `role-performance-grid`: Responsive grid layout system for role performance cards that adapts to desktop viewport sizes while maintaining readability of metrics and KPIs

### Modified Capabilities
- `responsive-ui`: Update existing responsive UI requirements to include specific grid layout behavior for role performance section

## Impact

- Modified components: Role Performance section components
- Updated CSS/Tailwind classes for grid layout
- No breaking changes to existing APIs or data structures
- Improved user experience for desktop users viewing multiple role performance metrics
