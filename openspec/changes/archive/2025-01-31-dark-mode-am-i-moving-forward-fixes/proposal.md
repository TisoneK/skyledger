## Why

The "Am I Moving Forward" dashboard component has hard-coded light theme colors that create poor visibility and contrast in dark mode, making it difficult for users to read status indicators, text, and borders when dark theme is enabled.

## What Changes

- Replace hard-coded light colors with CSS theme tokens for dark mode compatibility
- Add proper dark variants for status indicators, borders, and background colors
- Ensure text contrast and readability align with the Chama Target Tracker component
- Maintain existing layout, logic, and copy without modifications

## Capabilities

### New Capabilities
- `dark-mode-ui-compliance`: Ensures dashboard components properly support dark theme with appropriate color tokens and contrast ratios

### Modified Capabilities
- `weekly-dashboard`: Update visual styling requirements for dark mode compatibility in the "Am I Moving Forward" component

## Impact

- **Affected Code**: `src/components/am-i-moving-forward.tsx`
- **Dependencies**: Uses existing shadcn/ui theme system and CSS custom properties
- **Systems**: Dashboard UI components and theme system
