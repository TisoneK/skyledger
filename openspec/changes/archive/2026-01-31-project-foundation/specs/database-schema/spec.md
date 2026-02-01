## ADDED Requirements

### Requirement: Financial roles data model
The system SHALL store financial data with clear role separation using a relational database schema.

#### Scenario: Role-based data storage
- **WHEN** user adds financial transactions
- **THEN** system stores each transaction with associated role (Personal, Sky Tech, Chama, Side Income)

### Requirement: Transaction tracking
The system SHALL record all income, expenses, and savings with timestamps, categories, and amounts.

#### Scenario: Transaction recording
- **WHEN** user enters a new transaction
- **THEN** system stores amount, type (income/expense), category, role, date, and description

### Requirement: Weekly data aggregation
The system SHALL support efficient querying of financial data by week ranges for weekly-centric views.

#### Scenario: Weekly summary query
- **WHEN** user requests weekly financial summary
- **THEN** system returns aggregated income, expenses, and savings for the specified week and role

### Requirement: Chama contribution tracking
The system SHALL specifically track Chama contributions with weekly targets and actual amounts.

#### Scenario: Chama tracking
- **WHEN** user records Chama contribution
- **THEN** system stores contribution amount, date, and compares against weekly target of Ksh. 250

### Requirement: Data relationships
The system SHALL maintain proper foreign key relationships between transactions, categories, and roles.

#### Scenario: Data integrity
- **WHEN** database operations are performed
- **THEN** system enforces referential integrity between related tables
