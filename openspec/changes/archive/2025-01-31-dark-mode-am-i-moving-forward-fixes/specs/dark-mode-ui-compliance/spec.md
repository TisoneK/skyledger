## ADDED Requirements

### Requirement: Dashboard components SHALL support dark mode theme compliance
Dashboard components SHALL use semantic color classes and CSS custom properties that automatically adapt to light and dark themes, ensuring proper contrast and readability in both modes. For the scope of this change, this requirement applies only to the "Am I Moving Forward" dashboard component.

#### Scenario: Component renders in dark mode
- **WHEN** user activates dark theme
- **THEN** dashboard component colors SHALL adapt using theme tokens
- **AND** text SHALL maintain proper contrast ratios
- **AND** borders and backgrounds SHALL be visible

#### Scenario: Component renders in light mode
- **WHEN** user uses light theme
- **THEN** dashboard component colors SHALL display appropriately
- **AND** visual hierarchy SHALL be maintained
- **AND** status indicators SHALL be clearly visible

### Requirement: Status indicators SHALL use theme-aware colors
Status indicators (success, warning, error) SHALL use semantic color classes that provide appropriate contrast in both light and dark themes. Status colors SHALL be derived from the application's semantic color system (e.g., CSS variables or utility classes mapped to success, warning, and destructive roles), not hard-coded color values.

#### Scenario: Success status displays
- **WHEN** component shows positive status
- **THEN** success indicators SHALL use theme-success colors
- **AND** SHALL be visible in both light and dark modes

#### Scenario: Warning status displays
- **WHEN** component shows cautionary status
- **THEN** warning indicators SHALL use theme-warning colors
- **AND** SHALL maintain readability in both themes

#### Scenario: Error status displays
- **WHEN** component shows negative status
- **THEN** error indicators SHALL use theme-destructive colors
- **AND** SHALL provide clear visual feedback in both themes

### Requirement: Text and borders SHALL use theme tokens
All text colors and border colors SHALL use CSS custom properties or semantic classes that adapt to the current theme.

#### Scenario: Text renders in dark mode
- **WHEN** dark theme is active
- **THEN** primary text SHALL use theme-foreground colors
- **AND** secondary text SHALL use theme-muted-foreground colors
- **AND** contrast ratios SHALL meet accessibility standards

#### Scenario: Borders render in dark mode
- **WHEN** dark theme is active
- **THEN** component borders SHALL use theme-border colors
- **AND** SHALL be visible against theme-background colors
- **AND** SHALL maintain visual hierarchy
