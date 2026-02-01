## MODIFIED Requirements

### Requirement: Custom PNG icons display in sidebar navigation
The system SHALL display custom PNG icons for each financial role in the sidebar navigation using the centralized role icon system instead of sidebar-specific icon paths.

#### Scenario: Sidebar displays custom icons
- **WHEN** user views the sidebar navigation
- **THEN** each role button SHALL display its corresponding PNG icon from the icons/roles directory
- **AND** icons SHALL be properly sized and aligned within buttons
- **AND** icons SHALL be loaded through the RoleIcon component

#### Scenario: Icon mapping consistency
- **WHEN** system renders role buttons
- **THEN** personal role SHALL display personal.png icon from icons/roles directory
- **AND** sky-tech role SHALL display all-roles.png icon from icons/roles directory
- **AND** chama role SHALL display chama.png icon from icons/roles directory
- **AND** side-income role SHALL display side-income.png icon from icons/roles directory

### Requirement: Image optimization and error handling
The system SHALL use Next.js Image components with proper optimization and fallback handling for PNG icons through the centralized role icon system.

#### Scenario: Image loading optimization
- **WHEN** PNG icons are rendered via RoleIcon component
- **THEN** system SHALL use Next.js Image component
- **AND** icons SHALL be optimized for web performance
- **AND** proper sizing SHALL be applied (24x24px for sidebar)
- **AND** icon paths SHALL be resolved from icons/roles directory

#### Scenario: Icon loading error fallback
- **WHEN** PNG icon fails to load from icons/roles directory
- **THEN** system SHALL display fallback Lucide icon
- **AND** user experience SHALL remain uninterrupted
- **AND** error SHALL be logged with correct path information

### Requirement: Accessibility compliance for custom icons
The system SHALL maintain accessibility standards when using custom PNG icons in navigation through the RoleIcon component.

#### Scenario: Screen reader compatibility
- **WHEN** screen reader encounters sidebar icons rendered by RoleIcon
- **THEN** icons SHALL have appropriate alt text based on role type
- **AND** decorative icons SHALL use aria-hidden attribute
- **AND** role information SHALL be properly conveyed through component props

#### Scenario: Keyboard navigation
- **WHEN** user navigates sidebar with keyboard
- **THEN** icon buttons rendered by RoleIcon SHALL be fully accessible
- **AND** focus states SHALL be clearly visible
- **AND** component SHALL maintain proper ARIA attributes
