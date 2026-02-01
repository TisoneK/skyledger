# SkyLedger UI/UX Improvement Roadmap

This document tracks identified visual and functional friction points to align the dashboard with the core philosophy: **"Clarity over Complexity."**

---

## 1. Role Performance Cards (High Priority)
* **Issue:** Text overlapping and data collision. The labels "Income" and "Expenses" are smushed against the currency values.
* **Impact:** Violates "Modern, Polished UX" and makes data hard to read at a glance.
* **The Fix:** * Implement a vertical `flex-col` layout with a `gap-2`.
    * Use a clear visual separator (border-t) for the "Net" calculation area.
    * Ensure consistent padding across all role cards.

## 2. Weekly Trends & Charting (Medium Priority)
* **Issue:** Missing Legends & High Contrast Gridlines.
* **Impact:** Users cannot distinguish between data streams (e.g., Personal vs. Sky Tech) without hovering or guessing.
* **The Fix:** * **Add Legends:** Clearly label colors for Personal, Sky Tech, Side Income, and Chama.
    * **Soften Grids:** Reduce gridline opacity (e.g., `stroke-slate-800` or `opacity-20`).
    * **Precision Tooltips:** Ensure Recharts/Chart.js tooltips show the exact Ksh value for every data point.

## 3. Action Hierarchy (Medium Priority)
* **Issue:** Button visual weight is identical.
* **Impact:** "Export Report" (low frequency) looks as important as "Add Transaction" (high frequency).
* **The Fix:** * **Primary Action:** Make "Add Transaction" a solid, high-contrast button (Brand Blue).
    * **Secondary Actions:** Use `variant="outline"` or `variant="ghost"` for Analytics and Exporting.

## 4. Sidebar & Layout Efficiency (Medium Priority)
* **Issue:** "Quick Stats" are buried in the bottom of the sidebar.
* **Impact:** Forces the eye to the bottom left for the most important numbers (Total Income/Expenses).
* **The Fix:** * Move "Quick Stats" to the top of the main dashboard content area as a horizontal grid of summary cards.
    * Keep the sidebar strictly for filtering by "Financial Roles."

## 5. Chama Target Tracker (Low Priority)
* **Issue:** Low contrast on goal text.
* **Impact:** Sub-optimal accessibility for the core "Tuesday" anchor feature.
* **The Fix:** * Increase font weight for "Ksh 250 to go!"
    * Ensure the progress bar color clearly signals "Work to do" (Yellow/Orange) vs "Complete" (Green).

## 6. General Cleanup
* **Issue:** "TAILWIND TEST" red box persists in the header/hero area.
* **The Fix:** Remove the placeholder once styling is confirmed.
