## Context

SkyLedger is currently just documentation and vision. We need to build the technical foundation from scratch to create a functional personal finance dashboard. The system must handle 4 distinct financial roles (Personal, Sky Tech Solutions, Chama, Side Income) with weekly-centric views and offline-first capabilities. The target user will primarily access this on mobile devices, with Tuesday being a critical day for Chama contributions.

## Goals / Non-Goals

**Goals:**
- Create a scalable Next.js architecture that supports offline-first functionality
- Implement a robust data layer that works seamlessly online and offline
- Establish a clean separation between financial roles while providing unified insights
- Build a responsive, mobile-first UI that loads in under 1 second
- Set up proper state management for complex financial data flows

**Non-Goals:**
- Multi-user support (single-user personal finance tool)
- Real-time collaboration features
- Advanced reporting beyond basic weekly views
- Integration with external banking APIs (manual entry for now)

## Decisions

### Architecture: Next.js App Router + PWA
**Decision**: Using Next.js App Router with PWA capabilities instead of Create React App
**Rationale**: App Router provides better SEO, built-in optimizations, and server components for initial data loading. PWA capabilities enable offline functionality and mobile app-like experience.

### Database: SQLite + Prisma + IndexedDB Hybrid
**Decision**: SQLite with Prisma for persistent storage, IndexedDB for offline caching
**Rationale**: SQLite provides robust relational data integrity, while IndexedDB enables instant offline access. The sync layer will handle reconciliation between the two.

### State Management: Zustand over Redux
**Decision**: Zustand for client-side state management
**Rationale**: Simpler API, less boilerplate, and better TypeScript support. For a single-user app, Redux's complexity isn't justified.

### UI Framework: Tailwind + shadcn/ui
**Decision**: Tailwind CSS with shadcn/ui component library
**Rationale**: Rapid development with consistent design system, excellent mobile responsiveness, and accessible components out of the box.

### Offline Strategy: Service Worker + Sync Queue
**Decision**: Service worker for caching, sync queue for offline operations
**Rationale**: Provides true offline capability with automatic sync when connectivity returns. Queue-based approach prevents data loss.

## Risks / Trade-offs

**[Data Sync Complexity]** → Implementing robust conflict resolution for offline changes
**Mitigation**: Start with simple last-write-wins strategy, evolve to operational transformation if needed

**[Mobile Performance]** → SQLite operations on mobile devices may be slow
**Mitigation**: Use Web Workers for database operations, implement proper indexing and query optimization

**[Role Separation Complexity]** → Managing 4 distinct financial views may create UI confusion
**Mitigation**: Clear visual separation, color-coded roles, and persistent role selection state

**[Weekly Data Aggregation]** → Calculating weekly metrics across roles could impact performance
**Mitigation**: Pre-compute weekly aggregates, use efficient date indexing, implement lazy loading

## Migration Plan

1. **Phase 1**: Project setup and basic structure
   - Initialize Next.js with TypeScript
   - Configure Tailwind CSS and shadcn/ui
   - Set up Prisma with SQLite schema

2. **Phase 2**: Core data layer
   - Implement IndexedDB offline storage
   - Create sync queue system
   - Build basic CRUD operations

3. **Phase 3**: UI foundation
   - Create layout components
   - Implement role-based navigation
   - Build basic dashboard skeleton

4. **Phase 4**: Integration and testing
   - Connect UI to data layer
   - Test offline/online sync
   - Optimize performance

## Open Questions

- How to handle data conflicts when same transaction is modified offline and online?
- Should we implement incremental sync or full sync on reconnection?
- What's the optimal data retention policy for offline storage?
- How to handle Tuesday Chama reminders when device is offline?
