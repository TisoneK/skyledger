## ADDED Requirements

### Requirement: Enhanced navigation header displays consistent branding
The navigation header SHALL display the application title, subtitle, and theme toggle on all pages to provide consistent branding and user experience.

#### Scenario: Navigation header shows title and subtitle
- **WHEN** user views any page in the application
- **THEN** navigation header displays "SkyLedger" as the main title in green color
- **AND** displays "Your weekly financial mirror" as subtitle on screens 640px and wider

#### Scenario: Navigation header includes theme toggle
- **WHEN** user views any page in the application  
- **THEN** theme toggle button is visible and functional in the navigation header
- **AND** theme toggle is positioned to the left of the sync status

### Requirement: Responsive subtitle behavior
The navigation header SHALL hide the subtitle on mobile devices to maintain clean visual appearance while preserving desktop experience.

#### Scenario: Subtitle hidden on mobile
- **WHEN** user views the application on a screen smaller than 640px
- **THEN** subtitle "Your weekly financial mirror" is not displayed
- **AND** main title "SkyLedger" remains visible

#### Scenario: Subtitle visible on larger screens
- **WHEN** user views the application on a screen 640px or wider
- **THEN** subtitle "Your weekly financial mirror" is displayed below the main title

### Requirement: Theme toggle accessibility from all pages
Users SHALL be able to toggle between light and dark themes from any page in the application.

#### Scenario: Theme switching from non-dashboard pages
- **WHEN** user is on any page other than dashboard and clicks theme toggle
- **THEN** application theme changes between light and dark modes
- **AND** theme preference persists across page navigation

#### Scenario: Theme toggle maintains functionality
- **WHEN** user clicks theme toggle in navigation header
- **THEN** theme toggle behaves identically to previous dashboard implementation
- **AND** all existing theme switching animations and transitions are preserved

### Requirement: Dashboard page header removal
The dashboard page SHALL remove the redundant header section to provide more space for content and eliminate duplication.

#### Scenario: Dashboard without redundant header
- **WHEN** user navigates to the dashboard page
- **THEN** dashboard page does not display a separate title and theme toggle header
- **AND** dashboard content starts directly with Quick Stats section
- **AND** all dashboard functionality remains intact

### Requirement: Sync status integration preservation
The navigation header SHALL maintain existing sync status functionality while integrating the new theme toggle.

#### Scenario: Sync status remains functional
- **WHEN** theme toggle is added to navigation header
- **THEN** sync status display continues to show current synchronization state
- **AND** sync status positioning maintains proper visual hierarchy
- **AND** sync status color coding and animations are preserved
