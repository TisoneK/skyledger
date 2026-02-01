## Why

The financial summary cards at the top of the main page create visual clutter and take up valuable screen real estate that could be better used for more important dashboard content. Moving or removing this section will improve the overall design and user experience of the main dashboard.

## What Changes

- Remove the financial summary section from the top of src/app/page.tsx (lines 28-53)
- Eliminate the 4 cards showing Total Income, Total Expenses, Net Income, and Transactions from the prominent top position
- Clean up the grid layout to create more space for main dashboard content
- **BREAKING**: Changes the visual layout and information hierarchy of the main dashboard

## Capabilities

### New Capabilities
- `improved-dashboard-layout`: Establishes a cleaner main page layout with better visual hierarchy

### Modified Capabilities
- None (no existing spec requirements are changing)

## Impact

- **Design**: Cleaner visual layout with reduced clutter at the top of the dashboard
- **User Experience**: Better focus on primary dashboard content without competing financial summary
- **Screen Real Estate**: More space available for important dashboard components
- **Visual Hierarchy**: Improved information architecture on the main page
