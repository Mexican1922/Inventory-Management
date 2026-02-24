# Enhanced Analytics Implementation Plan

**Goal:** Integrate Recharts to provide visual data insights on the Dashboard.

---

### Task 1: Setup and Dependencies

**Step 1: Install Recharts**

```bash
npm install recharts
```

---

### Task 2: Create Category Distribution Chart

**Files:**

- Create: `src/components/dashboard/CategoryDistribution.tsx`

**Step 1: Implement Donut Chart**

- Aggregate product quantities by category.
- Use a custom tooltip and legend.
- Implement a premium color palette.

---

### Task 3: Create Stock Movement Trend Chart

**Files:**

- Create: `src/components/dashboard/StockMovementChart.tsx`

**Step 1: Implement Area Chart**

- Parse `inventory_logs` into daily buckets.
- Show "Incoming" vs "Outgoing" lines.
- Add responsiveness.

---

### Task 4: Integrate into Dashboard

**Files:**

- Modify: `src/pages/Dashboard.tsx`

**Step 1: Layout Update**

- Add a new grid row for charts.
- Connect the components to real-time data hooks.

---

### Task 5: Refine Esthetics

- Ensure charts use CSS variables for theme-consistent colors (primary, muted, etc.).
- Add subtle entrance animations.
