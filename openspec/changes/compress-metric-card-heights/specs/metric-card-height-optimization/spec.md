## ADDED Requirements

### Requirement: Responsive metric card height optimization
The system SHALL reduce the vertical height of MetricCard components by 20-30% on desktop view while maintaining full functionality and responsive behavior.

#### Scenario: Desktop height reduction
- **WHEN** viewing the WeeklySnapshot component on desktop (md: breakpoint and above)
- **THEN** MetricCard components SHALL have reduced vertical height compared to current implementation
- **AND** all financial data SHALL remain visible and readable
- **AND** trend indicators SHALL display properly

#### Scenario: Mobile view preservation
- **WHEN** viewing the WeeklySnapshot component on mobile (below md: breakpoint)
- **THEN** MetricCard components SHALL maintain current height and spacing
- **AND** responsive behavior SHALL be unchanged

#### Scenario: Data display integrity
- **WHEN** metric cards are rendered with reduced height
- **THEN** Total Income, Total Expenses, and Net Income values SHALL display correctly
- **AND** percentage changes SHALL be visible
- **AND** trend indicators SHALL align properly

#### Scenario: Grid layout maintenance
- **WHEN** metric cards have reduced height
- **THEN** the grid-cols-1 md:grid-cols-3 gap-6 layout SHALL be preserved
- **AND** cards SHALL align properly in the grid
- **AND** spacing between cards SHALL remain consistent
