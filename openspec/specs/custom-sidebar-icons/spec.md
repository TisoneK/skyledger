## ADDED Requirements

### Requirement: Custom PNG icons display in sidebar navigation
The system SHALL display custom PNG icons for each financial role in the sidebar navigation instead of generic Lucide React icons.

#### Scenario: Sidebar displays custom icons
- **WHEN** user views the sidebar navigation
- **THEN** each role button SHALL display its corresponding PNG icon
- **AND** icons SHALL be properly sized and aligned within buttons

#### Scenario: Icon mapping consistency
- **WHEN** system renders role buttons
- **THEN** personal role SHALL display personal.png icon
- **AND** sky-tech role SHALL display all-roles.png icon
- **AND** chama role SHALL display chama.png icon
- **AND** side-income role SHALL display side-income.png icon

### Requirement: Image optimization and error handling
The system SHALL use Next.js Image components with proper optimization and fallback handling for PNG icons.

#### Scenario: Image loading optimization
- **WHEN** PNG icons are rendered
- **THEN** system SHALL use Next.js Image component
- **AND** icons SHALL be optimized for web performance
- **AND** proper sizing SHALL be applied (24x24px)

#### Scenario: Icon loading error fallback
- **WHEN** PNG icon fails to load
- **THEN** system SHALL display fallback Lucide icon
- **AND** user experience SHALL remain uninterrupted

### Requirement: Accessibility compliance for custom icons
The system SHALL maintain accessibility standards when using custom PNG icons in navigation.

#### Scenario: Screen reader compatibility
- **WHEN** screen reader encounters sidebar icons
- **THEN** icons SHALL have appropriate alt text
- **AND** decorative icons SHALL use aria-hidden attribute
- **AND** role information SHALL be properly conveyed

#### Scenario: Keyboard navigation
- **WHEN** user navigates sidebar with keyboard
- **THEN** icon buttons SHALL be fully accessible
- **AND** focus states SHALL be clearly visible
