## ADDED Requirements

### Requirement: Contextual role icon sizing
The RoleIcon component SHALL support contextual sizing that automatically applies appropriate sizes based on UI context.

#### Scenario: Automatic context detection
- **WHEN** RoleIcon component is rendered without explicit size
- **THEN** component SHALL detect UI context from parent component or CSS classes
- **AND** SHALL apply appropriate size preset for detected context

#### Scenario: Manual context specification
- **WHEN** developer provides context prop to RoleIcon
- **THEN** component SHALL use specified context for sizing
- **AND** SHALL ignore automatic context detection

#### Scenario: Size prop override
- **WHEN** developer provides explicit size prop to RoleIcon
- **THEN** component SHALL use explicit size instead of contextual sizing
- **AND** SHALL maintain backward compatibility with existing size prop usage

### Requirement: Size preset integration
The RoleIcon component SHALL integrate with centralized icon size configuration system.

#### Scenario: Preset size application
- **WHEN** RoleIcon applies contextual sizing
- **THEN** component SHALL retrieve size values from icon size configuration
- **AND** SHALL apply both width and height from the preset

#### Scenario: CSS class generation
- **WHEN** RoleIcon applies size preset
- **THEN** component SHALL generate appropriate Tailwind CSS classes (h-* w-*)
- **AND** classes SHALL match the pixel values from the configuration

#### Scenario: Fallback sizing
- **WHEN** icon size configuration is unavailable
- **THEN** component SHALL fallback to default size (16px)
- **AND** SHALL continue to function without errors

### Requirement: Responsive icon sizing
The RoleIcon component SHALL support responsive sizing that adapts to different screen sizes.

#### Scenario: Responsive breakpoints
- **WHEN** screen size changes across breakpoints
- **THEN** component SHALL adjust icon sizes according to responsive configuration
- **AND** SHALL maintain visual hierarchy at each breakpoint

#### Scenario: Mobile optimization
- **WHEN** viewed on mobile devices
- **THEN** component SHALL apply mobile-optimized size presets
- **AND** icons SHALL remain touch-friendly and visible

#### Scenario: Desktop enhancement
- **WHEN** viewed on desktop screens
- **THEN** component SHALL apply desktop-optimized size presets
- **AND** icons SHALL leverage available screen space appropriately

### Requirement: Size transition animations
The RoleIcon component SHALL support smooth transitions when icon sizes change.

#### Scenario: Context-based size changes
- **WHEN** icon context changes (e.g., card to sidebar)
- **THEN** component SHALL animate size transition smoothly
- **AND** transition duration SHALL be configurable

#### Scenario: Hover state sizing
- **WHEN** user hovers over interactive icons
- **THEN** component SHALL apply hover size increase
- **AND** animation SHALL be smooth and non-jarring

### Requirement: Accessibility sizing support
The RoleIcon component SHALL support accessibility requirements for icon sizing.

#### Scenario: High contrast mode
- **WHEN** high contrast mode is detected
- **THEN** component SHALL increase icon size for better visibility
- **AND** SHALL maintain contrast requirements

#### Scenario: Reduced motion preference
- **WHEN** user prefers reduced motion
- **THEN** component SHALL disable size transition animations
- **AND** SHALL still apply appropriate sizing

#### Scenario: Screen reader optimization
- **WHEN** screen reader is active
- **THEN** component SHALL ensure icons are appropriately sized for visual users
- **AND** SHALL maintain alt text and ARIA attributes
