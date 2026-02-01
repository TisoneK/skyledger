## ADDED Requirements

### Requirement: Centralized icon size configuration system
The system SHALL provide a centralized configuration system that defines icon size presets for different UI contexts.

#### Scenario: Define size presets
- **WHEN** system initializes icon size configuration
- **THEN** system SHALL provide predefined size presets for sidebar, cards, compact, and large contexts
- **AND** each preset SHALL define consistent pixel values for width and height

#### Scenario: Access size configuration
- **WHEN** any component requests icon size for a specific context
- **THEN** system SHALL return the appropriate size preset values
- **AND** size values SHALL be consistent across all components using the same context

### Requirement: Contextual icon sizing
The system SHALL support contextual sizing that automatically applies appropriate icon sizes based on UI context.

#### Scenario: Sidebar context sizing
- **WHEN** RoleIcon is used in sidebar context
- **THEN** system SHALL apply sidebar size preset (24px)
- **AND** icons SHALL maintain proper visual hierarchy in navigation

#### Scenario: Card context sizing
- **WHEN** RoleIcon is used in performance card context
- **THEN** system SHALL apply card size preset (20px)
- **AND** icons SHALL be appropriately sized for card layouts

#### Scenario: Compact context sizing
- **WHEN** RoleIcon is used in compact UI context
- **THEN** system SHALL apply compact size preset (16px)
- **AND** icons SHALL fit within tight spacing constraints

#### Scenario: Large context sizing
- **WHEN** RoleIcon is used in large display context
- **THEN** system SHALL apply large size preset (32px)
- **AND** icons SHALL be prominent and easily visible

### Requirement: Customizable icon size API
The system SHALL provide an API that allows customization of icon sizes globally or per context.

#### Scenario: Global size adjustment
- **WHEN** developer updates global icon size configuration
- **THEN** system SHALL apply size changes to all icon contexts
- **AND** changes SHALL reflect immediately across the application

#### Scenario: Context-specific size override
- **WHEN** developer specifies custom size for a specific context
- **THEN** system SHALL override default preset for that context only
- **AND** other contexts SHALL remain unaffected

#### Scenario: Dynamic size scaling
- **WHEN** system receives size scaling factor
- **THEN** system SHALL multiply all preset sizes by the scaling factor
- **AND** visual proportions SHALL be maintained across all contexts

### Requirement: Icon size validation
The system SHALL validate icon size values to ensure visual consistency and usability.

#### Scenario: Size range validation
- **WHEN** icon size configuration is set
- **THEN** system SHALL validate sizes are within acceptable range (12px - 64px)
- **AND** invalid sizes SHALL be rejected with appropriate error message

#### Scenario: Aspect ratio maintenance
- **WHEN** icon sizes are applied
- **THEN** system SHALL maintain 1:1 aspect ratio for all icons
- **AND** width and height SHALL always be equal
