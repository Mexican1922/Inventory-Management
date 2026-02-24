# Product Image Gallery Design

**Date:** 2026-02-24
**Topic:** Multi-image product gallery with immediate cloud uploads.

## Overview

Enable users to attach multiple images to products. Images are uploaded to Firebase Storage immediately upon selection to provide a fast, responsive user experience.

## Architecture

### 1. Storage Strategy

- **Bucket Path:** `products/{productId}/{filename}` for final images.
- **Temporary Uploads:** Initial uploads will use a `temp/{userId}/{timestamp}_{original_name}` path.
- **URL Storage:** Product documents in Firestore will store an array of strings called `imageUrls`.

### 2. User Interface

- **Dropzone Component:** A dedicated area in the `AddProductForm` and `EditProductForm` (if implemented) for dragging and dropping or clicking to select images.
- **Thumbnail Grid:** Displays images currently being uploaded or already attached to the product.
- **Upload Feedback:** Individual thumbnails will show a progress bar or a loading state until the Firebase download URL is available.
- **Removal Logic:** Users can click a "bin" or "x" button on a thumbnail to remove it. This will remove the URL from the form state and eventually the product record.

## Data Flow

1. **Selection:** User selects files via `<input type="file">` or Drag-and-Drop.
2. **Local Preview:** Create a temporary URL using `URL.createObjectURL` for instant visual feedback.
3. **Upload:** File is sent to Firebase Storage using `uploadBytesResumable` to track progress.
4. **State Update:** Once the upload completes, the task returns a Permanent Download URL which is added to the `imageUrls` state in the form.
5. **Form Submission:** When "Save Product" is clicked, the `imageUrls` array is saved as part of the Product document in Firestore.

## Error Handling

- **Upload Failure:** Show an "error" state on the individual thumbnail with a retry option.
- **File Constraints:** Limit file size (e.g., 5MB) and mime types (image/jpeg, image/png, image/webp).

## Security

- **Firebase Storage Rules:** Will be configured (later) to allow authenticated users to write only to their tenant/user paths.
