# 🔥 Firebase Setup Guide — StockFlow

This guide walks you through creating and connecting a Firebase project to StockFlow.
Estimated time: **10–15 minutes**.

---

## Step 1: Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Give it a name (e.g. `stockflow-inventory`)
4. **Disable** Google Analytics (not needed for this app)
5. Click **"Create project"** and wait for it to finish

---

## Step 2: Register a Web App

1. On the project overview page, click the **`</>`** (Web) icon
2. Name your app (e.g. `StockFlow Web`)
3. **Do NOT** check "Firebase Hosting" unless you plan to deploy there
4. Click **"Register app"**
5. You'll see a `firebaseConfig` object — **copy these values** — you'll need them in Step 5

---

## Step 3: Enable Authentication

1. In the left sidebar, go to **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in method**, enable:
   - ✅ **Email/Password** (click it → toggle Enable → Save)
   - ✅ **Google** (optional but recommended — click it → toggle Enable → add your support email → Save)
4. Under **Authorized domains**, `localhost` should already be listed (needed for local dev)

---

## Step 4: Create the Firestore Database

1. In the left sidebar, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add rules in a moment)
4. Select a region closest to you (e.g. `us-central`, `europe-west2`)
5. Click **"Done"**

### 4a. Set Firestore Security Rules

Go to the **Rules** tab in Firestore and paste the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'Admin';
    }

    function isManagerOrAbove() {
      return isAuthenticated() && getUserRole() in ['Admin', 'Manager'];
    }

    // Users collection: users can read their own doc, admins read all
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
    }

    // Products: anyone authenticated can read, managers+ can write
    match /products/{productId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAbove();
    }

    // Categories: anyone authenticated can read, managers+ can write
    match /categories/{categoryId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAbove();
    }

    // Suppliers: managers+ only
    match /suppliers/{supplierId} {
      allow read: if isManagerOrAbove();
      allow write: if isManagerOrAbove();
    }

    // Inventory logs: anyone authenticated can read, all can write (for sales mode)
    match /inventory_logs/{logId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin();
    }

    // Purchase Orders: managers+ only
    match /purchase_orders/{orderId} {
      allow read: if isManagerOrAbove();
      allow write: if isManagerOrAbove();
    }
  }
}
```

Click **"Publish"**.

---

## Step 5: Set Up Cloudinary (Free Image Hosting — No Credit Card)

Firebase Storage requires the Blaze (pay-as-you-go) plan. Instead, this project uses
**Cloudinary's free tier**: 25 GB storage + 25 GB bandwidth/month, forever free, no credit card.

### 5a. Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up with your email (no credit card asked)
3. After signing in, you'll land on the **Dashboard**
4. Note your **Cloud name** (shown at the top of the dashboard, e.g. `dxyz1abc2`)

### 5b. Create an Upload Preset

An "upload preset" allows the browser to upload directly without a backend server.

1. In the Cloudinary dashboard, click the **⚙️ Settings** gear icon (top right)
2. Go to the **Upload** tab
3. Scroll down to **Upload presets** and click **"Add upload preset"**
4. Set these values:
   - **Preset name**: `stockflow_products` (you can choose any name)
   - **Signing mode**: Set to **Unsigned** ← this is critical
   - **Folder**: `stockflow/products` (optional, keeps images organized)
5. Click **"Save"**

### 5c. Add to Your `.env` File

Open `.env` and fill in the two new Cloudinary variables:

```env
VITE_CLOUDINARY_CLOUD_NAME=dxyz1abc2        ← your cloud name from the dashboard
VITE_CLOUDINARY_UPLOAD_PRESET=stockflow_products  ← the preset name you just created
```

That's it! The app will now upload product images to Cloudinary and store the resulting URLs in Firestore.

---

## Step 6: Fill in Your .env File

Open `.env` in the project root and replace all the placeholder values with your real Firebase config from Step 2:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123...
```

> ⚠️ **Never commit your `.env` file to Git.** It's already in `.gitignore`.

---

## Step 7: Create Your First Admin User

Since there's no "sign up" flow in the app (by design — you don't want random people signing up), you create the first user manually:

1. In Firebase Console → **Authentication → Users** tab
2. Click **"Add user"**
3. Enter your email and a password
4. Click **"Add user"**
5. Copy the **User UID** shown in the table

Now create their Firestore document:

1. Go to **Firestore Database → Data**
2. Click **"Start collection"** → ID: `users` → Click **Next**
3. Document ID: paste the UID from step 5 above
4. Add these fields:
   - `email` (string): your email address
   - `role` (string): `Admin`
5. Click **Save**

Now when you log in with that email/password, the app will recognize you as an Admin.

---

## Step 8: Run the App

```bash
npm run dev
```

Navigate to `http://localhost:5173` — you should be redirected to the login page. Log in with the credentials you created in Step 7.

---

## Step 9: Create Firestore Indexes (if prompted)

When you first load data, Firestore may show errors in the browser console like:

> `The query requires an index. You can create it here: https://...`

Simply click the link in the console — it opens the Firebase Console with the index pre-filled. Click **"Create index"** and wait 1–2 minutes. This is normal for compound queries (e.g. `orderBy` + `where`).

---

## ✅ You're Done!

Your Firebase backend is now live and connected. The app will:

- Authenticate users via Firebase Auth
- Store all data in Firestore (products, categories, suppliers, orders, logs)
- Upload product images to Firebase Storage
- Enforce role-based access via Firestore Security Rules

---

## Optional: Adding More Team Members

You don't use the Firebase Auth "Add user" flow for team members — instead:

1. In the app, go to **Settings → Team Management**
2. Have the new member sign in via Google, OR manually create them in Firebase Auth
3. Their document gets created automatically in Firestore with `role: "Viewer"` on first login
4. An Admin can then go to Settings → Team Management and change their role
