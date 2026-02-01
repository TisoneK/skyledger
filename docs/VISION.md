# SkyLedger – Personal Finance & Activity Dashboard

## 1. Purpose & Philosophy

This dashboard is not just a tool for recording numbers — it is a **personal financial mirror**. Its primary goal is to help you *see clearly*:
- Where your money comes from
- Where it goes
- What grows over time

The philosophy is **clarity over complexity**. If a system is too complex, it will be abandoned. If it is clear and honest, it becomes a habit.

This dashboard should answer one core question every time you open it:

> *"Am I financially moving forward this week?"*

---

## 2. Financial Identity (How You Relate to Money)

You operate in **multiple financial roles at once**:

- **Individual** – personal spending, survival costs, personal savings
- **Business owner (Sky Tech Solutions)** – income, reinvestment, profit awareness
- **Group member (Chama)** – discipline, consistency, long-term collective growth
- **Service provider (Cyber shop & side activities)** – daily cash flow

The dashboard must **respect these roles without mixing them**. Mixing roles causes confusion and false conclusions.

> One person, many wallets — but one clear picture.

---

## 3. Core Financial Streams to Track

### A. Income Streams
Not all income is equal. The dashboard should *differentiate sources*, not just totals.

- Cyber shop daily earnings
- Sky Tech Solutions income (projects, services, contracts)
- Side or external income

**Philosophy:**
> Income clarity creates confidence. Vague income creates anxiety.

---

### B. Spending Streams
Spending is not the enemy — **untracked spending is**.

Spending should be viewed in categories:
- Personal living expenses
- Business-related expenses (tools, internet, supplies)
- Emergency or unexpected costs

**Philosophy:**
> Money spent intentionally is never wasted.

---

### C. Savings & Commitments
Savings represent *future stability*, not restriction.

This includes:
- Weekly Chama contributions (CHEPTAIS CORNER MALI MALI JUA KALI SHG)
  - Minimum: Ksh. 50
  - Personal target: **Ksh. 250 per week**
- Personal savings
- Business reserves (Sky Tech Solutions)

**Philosophy:**
> Saving is paying your future self first.

---

## 4. Weekly Rhythm (Why Tuesday Matters)

Your financial rhythm revolves around **weeks**, not months.

Tuesday is significant because:
- It anchors your Chama discipline
- It provides a natural weekly checkpoint

The dashboard should support a **weekly reflection habit**:
- What came in this week?
- What went out this week?
- Did I meet my Chama target?
- Am I better than last week?

**Philosophy:**
> Progress measured weekly becomes growth measured yearly.

---

## 5. Sky Tech Solutions as a Growth Engine

Sky Tech Solutions should be treated as:
- A **separate financial entity**
- A long-term asset, not just daily cash

The dashboard should help you *see*:
- Whether Sky Tech is funding your life or draining it
- Whether it is growing, stagnant, or shrinking

**Philosophy:**
> A business that is not measured is a hobby.

---

## 6. Decision Support, Not Just Record Keeping

The dashboard should help you make **better decisions**, such as:
- Can I safely increase my Chama contribution?
- Can Sky Tech fund a new tool or investment?
- Am I spending more than I earn this month?

It should reduce emotional decisions and replace them with calm awareness.

**Philosophy:**
> Numbers remove fear. Ignorance creates it.

---

## 7. Modern, Polished User Experience

This is **not a minimal project anymore**. SkyLedger should be:
- Visually appealing and professional
- Responsive across all devices
- Fast and fluid in interactions
- Intuitive without lengthy tutorials

**Philosophy:**
> A tool you enjoy using is a tool you'll actually use.

---

## 8. Long-Term Vision

Over time, this dashboard becomes:
- Your financial memory
- Proof of discipline
- Evidence of growth

It will help you look back and say:
> *"This is where consistency changed my life."*

---

## 9. Closing Principle

This dashboard is not about money alone.

It is about:
- Control
- Responsibility
- Independence
- Intentional growth

> **Money is a tool. Awareness is the power behind it.**

---

## 10. Tech Stack

### Frontend
- **Next.js (App Router)** – Modern React framework with built-in optimizations
- **Tailwind CSS** – Utility-first styling for rapid, beautiful UI development
- **shadcn/ui** – Beautiful, accessible component library
- **Recharts or Chart.js** – Data visualization for financial trends
- **Lucide React** – Clean, modern icons

### State Management
- **Zustand** – Lightweight state management
- **TanStack Query (React Query)** – Data fetching and caching

### Backend
- **Next.js API Routes** – RESTful API endpoints
- **SQLite with Prisma** – Local-first database for data persistence
- **TypeScript** – Type safety throughout

### Offline Capabilities
- **IndexedDB (via idb library)** – Local data storage for offline access
- **Service Workers** – PWA functionality
- **Sync queue system** – Queue changes and sync when back online

### Development Tools
- **ESLint + Prettier** – Code quality and consistency
- **Git** – Version control

---

## 11. No Tests (For Now)

Focus is on rapid iteration and delivering core functionality. Testing infrastructure can be added later as the project matures.

---

## 12. Offline-First Architecture

SkyLedger must work **seamlessly offline**:
- All data is stored locally first
- Changes sync automatically when connection is restored
- No data loss during disconnection periods
- Visual indicator of sync status

**Philosophy:**
> Your financial awareness shouldn't depend on internet availability.

---

## 13. Key Features to Build

### Phase 1: Foundation
- Dashboard overview (weekly snapshot)
- Income entry (by source)
- Expense entry (by category)
- Chama contribution tracking
- Basic data visualization (weekly trends)

### Phase 2: Intelligence
- Weekly comparisons (vs. previous weeks)
- Sky Tech Solutions profit/loss tracking
- Savings goals and progress
- Smart notifications (Chama due, spending alerts)

### Phase 3: Growth
- Monthly and yearly reports
- Export functionality (PDF/CSV)
- Multi-device sync
- Data backup and restore

---

## 14. Success Metrics

SkyLedger succeeds when:
- You open it every Tuesday without fail
- You can answer "Am I financially moving forward?" in 5 seconds
- You make at least one better financial decision per week because of it
- You feel in control, not anxious, about money

> **This is your financial operating system. Build it well.**

---

## 15. Non-Negotiable Technical Requirements

These MUST be respected in every change:

1. **Offline-first** - Every feature works without internet
2. **Weekly-centric** - Data views default to "this week"
3. **Role separation** - Never mix personal/business/Chama in the same view
4. **Tuesday awareness** - System knows Chama day and prompts accordingly
5. **Fast** - Dashboard loads in <1 second (even offline)
6. **Mobile-first responsive** - You'll check this on your phone

If a proposed change violates these, reject it.
