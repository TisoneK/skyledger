## Why

The application currently uses generic gradient placeholder icons throughout, creating an inconsistent brand identity. Replacing these with a custom SkyLedger brand icon will establish professional visual recognition and improve user experience through consistent branding.

## What Changes

- Create organized asset structure in `public/assets/icons/`
- Move existing `icon.png` to `public/assets/icons/skyledger-icon.png`
- Develop reusable `SkyLedgerIcon` component with TypeScript props
- Replace placeholder icons in navigation header (32x32px) and sidebar (24x24px)
- Implement Next.js Image optimization for performance

## Capabilities

### New Capabilities
- `brand-icon-system`: Establishes a structured brand icon system with reusable components and optimized asset management

### Modified Capabilities
- None (no existing spec requirements are changing)

## Impact

- **Code**: New component `src/components/ui/skyledger-icon.tsx`, modifications to `src/components/layout/main-layout.tsx`
- **Assets**: New organized asset structure in `public/assets/icons/`
- **Dependencies**: None (uses existing Next.js Image optimization)
- **Systems**: No breaking changes to existing APIs or functionality
