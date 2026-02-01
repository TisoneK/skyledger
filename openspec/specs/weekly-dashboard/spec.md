## MODIFIED Requirements

### Requirement: Weekly snapshot view
The system SHALL display a comprehensive weekly financial snapshot as the default dashboard view with Quick Stats positioned in the main content area.

#### Scenario: Dashboard loading
- **WHEN** user opens the application
- **THEN** system shows current week's income, expenses, and savings across all roles
- **AND** Quick Stats (Total Income/Expenses) SHALL appear in the top section of main content area as horizontal summary cards

### Requirement: Role-based weekly summaries
The system SHALL show separate weekly summaries for each financial role with optimized layout.

#### Scenario: Role summary display
- **WHEN** user views the weekly dashboard
- **THEN** system displays distinct sections for Personal, Sky Tech, Chama, and Side Income with weekly totals
- **AND** role summaries SHALL be positioned below Quick Stats in the main content area

### Requirement: Weekly comparison
The system SHALL provide comparison between current week and previous weeks.

#### Scenario: Week-over-week analysis
- **WHEN** user views weekly data
- **THEN** system shows comparison with previous week and 4-week average

### Requirement: Tuesday Chama focus
The system SHALL highlight Chama contribution status, especially on Tuesdays.

#### Scenario: Tuesday reminder
- **WHEN** user opens dashboard on Tuesday
- **THEN** system prominently displays Chama contribution status and weekly target progress

### Requirement: Quick transaction entry
The system SHALL provide quick entry forms for adding income and expenses from the dashboard.

#### Scenario: Rapid transaction entry
- **WHEN** user wants to add a transaction
- **THEN** system offers quick form with role selection, amount, and category fields

### Requirement: Sidebar focuses on navigation
The system SHALL use sidebar exclusively for financial role navigation.

#### Scenario: Sidebar displays role options
- **WHEN** user views the sidebar
- **THEN** sidebar SHALL contain only Financial Roles section
- **AND** sidebar SHALL not contain Quick Stats or other summary information
