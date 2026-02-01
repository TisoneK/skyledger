## ADDED Requirements

### Requirement: Role cards display financial data with clear visual separation
The system SHALL present role performance cards with proper spacing between labels and values to prevent text overlap.

#### Scenario: Role card displays income and expenses
- **WHEN** user views the dashboard
- **THEN** each role card SHALL display "Income" and "Expenses" labels with adequate vertical spacing from their corresponding currency values
- **AND** the "Net" section SHALL be visually separated with a top border or background tint

#### Scenario: Role cards maintain responsive behavior
- **WHEN** user resizes the browser window
- **THEN** role cards SHALL maintain proper spacing and text alignment across all screen sizes
- **AND** no text elements SHALL overlap or collide

### Requirement: Role cards use consistent padding and layout
The system SHALL apply uniform spacing and padding across all role performance cards.

#### Scenario: Multiple role cards displayed
- **WHEN** dashboard shows Personal, Sky Tech, Chama, and Side Income cards
- **THEN** all cards SHALL use identical spacing patterns
- **AND** visual hierarchy SHALL be consistent across all roles
