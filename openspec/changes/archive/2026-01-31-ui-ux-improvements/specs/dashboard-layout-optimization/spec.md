## ADDED Requirements

### Requirement: Quick Stats moved to main dashboard area
The system SHALL display Quick Stats in the main content area rather than the sidebar for better visibility.

#### Scenario: Dashboard loads with Quick Stats
- **WHEN** user accesses the main dashboard
- **THEN** Quick Stats (Total Income/Expenses) SHALL appear in the top section of main content
- **AND** stats SHALL be displayed as horizontal summary cards

#### Scenario: User views financial overview
- **WHEN** user scans the dashboard for key metrics
- **THEN** Quick Stats SHALL be immediately visible without scrolling to sidebar
- **AND** stats SHALL use prime real estate at top of main content area

### Requirement: Sidebar focuses on navigation and filtering
The system SHALL use sidebar exclusively for financial role navigation and filtering.

#### Scenario: Sidebar displays role options
- **WHEN** user views the sidebar
- **THEN** sidebar SHALL contain only Financial Roles section
- **AND** sidebar SHALL not contain Quick Stats or other summary information

#### Scenario: User switches between roles
- **WHEN** user clicks on different financial roles
- **THEN** role switching SHALL function as before
- **AND** sidebar SHALL maintain its focused navigation purpose

### Requirement: Layout maintains responsive behavior
The system SHALL ensure the new layout works properly across all device sizes.

#### Scenario: Mobile view of dashboard
- **WHEN** user accesses dashboard on mobile device
- **THEN** Quick Stats SHALL adapt to mobile layout
- **AND** sidebar SHALL remain functional for role switching
