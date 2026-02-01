## ADDED Requirements

### Requirement: Sidebar icons organized in dedicated directory
The system SHALL store all sidebar navigation icons in the `public/icons/sidebar/` directory with consistent kebab-case naming.

#### Scenario: Icon directory structure
- **WHEN** viewing the project file system
- **THEN** all sidebar icons SHALL be located in `public/icons/sidebar/`
- **AND** each icon SHALL follow kebab-case naming convention

### Requirement: Icon path references updated in components
The system SHALL update all component references to use the new icon paths from the dedicated directory.

#### Scenario: Component icon imports
- **WHEN** sidebar components render navigation items
- **THEN** they SHALL reference icons using `/icons/sidebar/[icon-name].png` paths
- **AND** all icons SHALL load correctly without broken references

### Requirement: Root directory cleanup
The system SHALL remove all sidebar icon files from the project root directory after migration.

#### Scenario: Clean root directory
- **WHEN** examining the project root
- **THEN** no sidebar icon files SHALL be present
- **AND** all icons SHALL be properly located in the dedicated directory
