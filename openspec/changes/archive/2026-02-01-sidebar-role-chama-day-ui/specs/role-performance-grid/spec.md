## MODIFIED Requirements

### Requirement: Responsive grid layout for role performance cards
**Reason**: Sidebar width reduction requires adjustment of role performance card layout to maintain readability
**Migration**: Update grid responsive breakpoints to accommodate reduced sidebar width

#### Scenario: Desktop viewport 1024px-1440px with reduced sidebar
- **WHEN** user views role performance section on desktop with viewport width between 1024px and 1440px and reduced sidebar width
- **THEN** system SHALL display role performance cards in optimized 2-column grid layout
- **AND** card content SHALL adapt to slightly reduced available width
- **AND** all metrics SHALL remain fully readable without clipping

#### Scenario: Large desktop viewport >1440px with reduced sidebar
- **WHEN** user views role performance section on desktop with viewport width greater than 1440px and reduced sidebar width
- **THEN** system SHALL display role performance cards in 3-column grid layout
- **AND** card width SHALL be optimized for new sidebar dimensions
- **AND** content SHALL maintain proper spacing and readability

#### Scenario: Content adaptation to reduced width
- **WHEN** sidebar width is reduced by 15-20%
- **THEN** role performance cards SHALL adjust internal layout to fit reduced space
- **AND** metric text SHALL maintain minimum readable font size
- **AND** KPI values SHALL remain fully visible without horizontal scrolling
