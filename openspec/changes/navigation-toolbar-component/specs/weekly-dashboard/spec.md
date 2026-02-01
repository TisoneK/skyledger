## MODIFIED Requirements

### Requirement: Weekly snapshot view
The system SHALL display a comprehensive weekly financial snapshot as the default dashboard view with Quick Stats positioned in the main content area and Quick Actions removed from embedded location.

#### Scenario: Dashboard loading
- **WHEN** user opens the application
- **THEN** system shows current week's income, expenses, and savings across all roles
- **AND** Quick Stats (Total Income/Expenses) SHALL appear in the top section of main content area as horizontal summary cards
- **AND** Quick Actions section SHALL NOT appear within the weekly snapshot component
- **AND** Quick Actions functionality SHALL be available in the header component

### Requirement: Role-based weekly summaries
The system SHALL show separate weekly summaries for each financial role with optimized layout.

#### Scenario: Role summary display
- **WHEN** user views the weekly dashboard
- **THEN** system displays distinct sections for Personal, Sky Tech, Chama, and Side Income with weekly totals
- **AND** role summaries SHALL be positioned below Quick Stats in the main content area
- **AND** Quick Actions section SHALL NOT appear between role summaries and other content

## REMOVED Requirements

### Requirement: Embedded Quick Actions section
**Reason**: Quick Actions are now provided by the header component for better UX and accessibility across all application pages
**Migration**: Quick Actions functionality is now available in the header component at the top of every page

#### Scenario: Previous embedded Quick Actions
- **WHEN** user previously viewed weekly snapshot
- **THEN** Quick Actions section appeared embedded in the middle of the weekly snapshot content
- **AND** this placement created poor UX by positioning actions away from the main navigation area
