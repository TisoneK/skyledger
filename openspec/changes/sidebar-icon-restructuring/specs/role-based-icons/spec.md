## ADDED Requirements

### Requirement: Centralized role icon system
The system SHALL provide a centralized role icon system that allows any component to access financial role icons through a consistent interface.

#### Scenario: Component requests role icon
- **WHEN** any component requests a role icon
- **THEN** system SHALL provide the correct icon from the centralized role icon directory
- **AND** icon SHALL be optimized and cached appropriately

#### Scenario: Role icon types
- **WHEN** system enumerates available role icons
- **THEN** system SHALL support personal, chama, side-income, and all-roles icon types
- **AND** each icon SHALL be accessible through a standardized naming convention

### Requirement: RoleIcon component interface
The system SHALL provide a RoleIcon component that accepts role type and optional styling parameters.

#### Scenario: Basic role icon usage
- **WHEN** developer uses `<RoleIcon type="personal" />`
- **THEN** component SHALL render the personal role icon
- **AND** icon SHALL be properly sized and optimized

#### Scenario: Role icon with custom styling
- **WHEN** developer uses `<RoleIcon type="chama" size="32" className="custom-class" />`
- **THEN** component SHALL render chama icon with specified size and classes
- **AND** component SHALL maintain accessibility attributes

### Requirement: Icon path management
The system SHALL manage icon paths automatically without requiring hardcoded paths in components.

#### Scenario: Icon path resolution
- **WHEN** RoleIcon component renders
- **THEN** system SHALL automatically resolve icon paths from icons/roles directory
- **AND** paths SHALL be environment-aware (development vs production)

#### Scenario: Fallback icon handling
- **WHEN** requested role icon is not found
- **THEN** system SHALL display a default fallback icon
- **AND** error SHALL be logged for debugging purposes

### Requirement: Performance optimization
The system SHALL optimize role icon loading and caching for better performance.

#### Scenario: Icon caching
- **WHEN** role icons are loaded
- **THEN** system SHALL implement appropriate caching strategies
- **AND** repeated requests SHALL use cached versions

#### Scenario: Lazy loading
- **WHEN** role icons are not immediately visible
- **THEN** system SHALL support lazy loading for off-screen icons
- **AND** performance impact SHALL be minimal
