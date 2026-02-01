## ADDED Requirements

### Requirement: Weekly snapshot view
The system SHALL display a comprehensive weekly financial snapshot as the default dashboard view.

#### Scenario: Dashboard loading
- **WHEN** user opens the application
- **THEN** system shows current week's income, expenses, and savings across all roles

### Requirement: Role-based weekly summaries
The system SHALL show separate weekly summaries for each financial role.

#### Scenario: Role summary display
- **WHEN** user views the weekly dashboard
- **THEN** system displays distinct sections for Personal, Sky Tech, Chama, and Side Income with weekly totals

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
