# Variants & Quick Sales (POS) Design

**Date:** 2026-02-24
**Topic:** Implementing product variations and a high-speed sales interface for staff.

## Overview

Expand the product model to support variations (Size, Color, etc.) and introduce a dedicated "Quick Sales" interface designed for high-speed operation by staff members.

## 1. Product Variations (Master-Variant System)

### Data Structure

Products can now be "Simple" or "Variable".

- **Simple Product:** Single SKU/Price/Qty (Current behavior).
- **Variable Product:** Acts as a container for multiple "Variants".
  - `variants`: Array of objects.
  - `options`: List of attributes (e.g., `[ { name: "Size", values: ["S", "M"] }, { name: "Color", values: ["Red"] } ]`).

### UI: Variant Generator

- A "Matrix Generator" in the `AddProductForm`.
- Users select attributes and values.
- App generates all combinations with default prices.
- Users can toggle specific variants off or override individual SKUs/Prices.

## 2. Quick Sales (POS Mode)

### The "Sales Sheet" View

A dedicated, mobile-friendly page (`/sales`) designed for sales staff.

- **Search & Scan:** Focus on a large search field for quick item lookup.
- **Grid Layout:** Large product cards with images.
- **The "Sell" Action:**
  - For Simple items: One-click "Sell" button (decrements 1 unit).
  - For Variable items: Opens a mini-tray to "Select Size" then click "Sold".
- **Visual Feedback:** Instant animation and "Success" toast for every sale recorded.

## 3. Revised Permission Matrix

| Role            | Access                                                    |
| :-------------- | :-------------------------------------------------------- |
| **Admin**       | Full system access + Admin settings.                      |
| **Manager**     | Full inventory/purchase control.                          |
| **Sales Staff** | Dashboard, Inventory (View), and **Sales Mode** (Active). |

## 4. Automation & Logging

Every "Sale" will:

1.  Decrement stock in Firestore.
2.  Create a log entry: `SALE: [Product Name] ([Variant]) sold by [User]`.
3.  Update the "Stock Movement" chart on the Dashboard in real-time.

## Success Criteria

- A manager can create a "T-Shirt" with 5 color/size combinations in under 30 seconds.
- A salesperson can record 3 sales of different items in under 10 seconds.
