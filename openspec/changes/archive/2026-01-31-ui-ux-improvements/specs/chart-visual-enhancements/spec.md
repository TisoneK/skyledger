## ADDED Requirements

### Requirement: Charts include clear legends for data series identification
The system SHALL display legends on multi-series charts to help users distinguish between different data streams.

#### Scenario: Income vs Expenses chart displays multiple roles
- **WHEN** user views the Income vs Expenses chart
- **THEN** chart SHALL include a legend showing colors for Personal, Sky Tech, Side Income, and Chama data
- **AND** legend SHALL be positioned to not overlap chart data

#### Scenario: Net Income Trend chart shows role breakdown
- **WHEN** user views the Net Income Trend chart
- **THEN** chart SHALL provide visual indicators for each role's contribution
- **AND** users SHALL be able to identify which line represents which financial role

### Requirement: Chart gridlines use reduced opacity for better readability
The system SHALL render gridlines with lower opacity to reduce visual noise while maintaining reference lines.

#### Scenario: Charts display background grid
- **WHEN** any chart renders gridlines
- **THEN** gridlines SHALL use reduced opacity (20-30%)
- **AND** gridlines SHALL not overpower the actual data visualization

### Requirement: Charts provide precise tooltips on hover
The system SHALL display exact currency values when users hover over data points.

#### Scenario: User hovers over chart data point
- **WHEN** user positions cursor over any data point
- **THEN** tooltip SHALL display the exact Ksh value (e.g., "Ksh 11,250")
- **AND** tooltip SHALL include the role name and time period for context
