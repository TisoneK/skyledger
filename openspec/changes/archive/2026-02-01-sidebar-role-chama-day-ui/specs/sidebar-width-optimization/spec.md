## ADDED Requirements

### Requirement: Sidebar width optimization
The system SHALL reduce the sidebar width by 15-20% while maintaining content readability and responsive behavior.

#### Scenario: Desktop viewport width reduction
- **WHEN** user views the application on desktop viewport (≥1024px)
- **THEN** sidebar width SHALL be reduced from current width to optimized width
- **AND** all content SHALL remain readable without clipping
- **AND** responsive behavior SHALL be preserved

#### Scenario: Tablet viewport adaptation
- **WHEN** user views the application on tablet viewport (768px-1023px)
- **THEN** sidebar SHALL adapt to reduced width using percentage-based sizing
- **AND** role performance data SHALL remain fully visible
- **AND** layout SHALL maintain proper proportions

#### Scenario: Mobile viewport compatibility
- **WHEN** user views the application on mobile viewport (<768px)
- **THEN** sidebar SHALL use mobile-optimized width
- **AND** content SHALL stack appropriately
- **AND** touch targets SHALL remain accessible (minimum 44px)
