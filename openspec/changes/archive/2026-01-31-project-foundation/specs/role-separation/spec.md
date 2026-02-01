## ADDED Requirements

### Requirement: Financial role isolation
The system SHALL maintain complete separation between the four financial roles: Personal, Sky Tech Solutions, Chama, and Side Income.

#### Scenario: Role data isolation
- **WHEN** user views financial data
- **THEN** system displays each role's data separately without mixing or aggregating across roles

### Requirement: Role-specific categories
The system SHALL provide distinct transaction categories for each financial role.

#### Scenario: Category selection
- **WHEN** user adds a transaction for a specific role
- **THEN** system shows only relevant categories for that role (e.g., business expenses for Sky Tech)

### Requirement: Role switching interface
The system SHALL allow users to switch between roles while maintaining context.

#### Scenario: Role navigation
- **WHEN** user clicks on a role tab or selector
- **THEN** system updates the interface to show only that role's data and relevant features

### Requirement: Role-based insights
The system SHALL provide insights and analytics specific to each role's context.

#### Scenario: Role-specific analytics
- **WHEN** user views analytics for Sky Tech role
- **THEN** system shows business-specific metrics like profit margins and reinvestment opportunities

### Requirement: Unified overview option
The system SHALL provide an optional unified view that combines all roles for overall financial health assessment.

#### Scenario: Combined view
- **WHEN** user requests unified financial overview
- **THEN** system displays aggregated data across all roles while maintaining role attribution
