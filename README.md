# Inventory Management System

A clean, minimal inventory management system for small to medium teams to track products, manage stock levels, and handle simple purchase orders. Built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Firebase.

## Features

- **Authentication & Authorization**: Role-based access control (Admin, Manager, Sales Staff, Viewer) using Firebase Auth.
- **Product Management**: Track name, SKU, barcode, description, images, cost/selling price, and supplier info. Supports hierarchical categories and product variants (size/color).
- **Inventory & Stock Control**: Manual stock adjustments with reason codes, audit logs, and low-stock alerts.
- **Purchase Orders**: Simple PO workflow (Pending -> Received) that automatically updates stock levels upon receipt.
- **Dashboard & Analytics**: Clean charts (Recharts) showing total stock value, top-selling products, low-stock items, and recent activity.
- **Enterprise Polish**: "Quick Sales" POS interface with barcode scanning (HTML5 QR Code), CSV export/reporting.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui + Radix UI
- **Backend/Database**: Firebase 12 (Firestore, Auth, Storage, Cloud Functions)
- **Forms & Validation**: React Hook Form + Zod + @hookform/resolvers
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Utilities**: date-fns
- **Routing**: React Router DOM v7

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd inventory-mgmt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password or Google), Firestore, and Storage.
   - Create a `.env` file in the root directory and add your Firebase configuration:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code quality and style issues:

```bash
npm run lint
```

## Project Structure

The codebase is organized as follows:

- `src/`: Main source code directory.
  - `components/`: Reusable UI components.
  - `pages/`: Route-based views.
  - `hooks/`: Custom React hooks.
  - `context/`: React context providers.
  - `lib/`: Utility functions and third-party libraries.
  - `types/`: TypeScript definitions.
  - `assets/`: Static assets such as images and fonts.
- `public/`: Public static assets.
- `docs/`: Additional documentation.
