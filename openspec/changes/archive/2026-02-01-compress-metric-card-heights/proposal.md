## Why

The WeeklySnapshot component's metric cards are currently too tall on desktop view, creating excessive vertical space that could be better utilized for displaying more financial data or improving the overall layout density.

## What Changes

- Reduce the vertical height of MetricCard components in the WeeklySnapshot component
- Optimize spacing and padding within the metric cards for desktop view (md: breakpoint and above)
- Maintain responsive behavior for mobile view
- Preserve all existing functionality and data display

## Capabilities

### New Capabilities
- `metric-card-height-optimization`: Defines requirements for responsive metric card height adjustments

### Modified Capabilities
- Leave empty - no existing spec requirements are changing, only implementation details

## Impact

- Affected code: `src/components/dashboard/weekly-snapshot.tsx` (lines 189-211)
- Affected component: MetricCard components within WeeklySnapshot
- No API changes required
- No new dependencies needed
- Maintains existing responsive grid layout (grid-cols-1 md:grid-cols-3 gap-6)
