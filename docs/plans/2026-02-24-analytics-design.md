# Enhanced Analytics Dashboard Design

**Date:** 2026-02-24
**Topic:** Interactive charts for category distribution and stock movements.

## Overview

Transform the Dashboard from static metrics into a data-driven intelligence center. We will implement high-fidelity visualizations to help users understand their inventory composition and historical movement.

## Architecture

### 1. Data Visualization Library

- **Recharts**: Chosen for its React-native feel, accessibility, and high performance with dynamic data.

### 2. Chart Types

- **Category Distribution (Donut Chart)**: Visualizes stock distribution by **Quantity** across different categories. This helps in spatial warehouse planning.
- **Stock Movement Trends (Area/Bar Chart)**: Visualizes historical "Stock In" (PO receipts) vs "Stock Out" (adjustments) over the last 7-30 days.

### 3. Data Processing

- **Aggregation Layer**: Use existing `useProducts` and `useInventoryLogs` hooks to aggregate data on the client side.
- **Color Palettes**: Implementation of a curated, harmonious HSL color system for chart segments to ensure a premium aesthetic.

## Implementation Details

### Components

- `CategoryChart.tsx`: A card-wrapped donut chart with a custom legend.
- `MovementChart.tsx`: A responsive area chart showing daily volume trends.

### Data Model for Movements

We will parse `inventory_logs` to group changes by date:

- `change > 0`: Categorized as "Incoming"
- `change < 0`: Categorized as "Outgoing"

## User Experience

- **Interactivity**: Hover states showing precise counts and percentages.
- **Responsive Design**: Charts will scale automatically from mobile to widescreen desktop layouts.

## Success Criteria

- Dashboard provides an immediate visual answer to "What is most of my stock?" and "Is my inventory growing or shrinking?"
