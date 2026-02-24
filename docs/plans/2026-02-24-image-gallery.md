# Product Image Gallery Implementation Plan

> **For Agent:** This plan is designed for step-by-step execution.

**Goal:** Implement a multi-image upload and gallery system for products using Firebase Storage.

**Architecture:**

- Immediate upload pattern: choosing a file triggers an upload to Firestore.
- Form state captures permanent URLs.
- The `Inventory` table will display the primary image.

**Tech Stack:** React, Firebase Storage, Lucide Icons, shadcn/ui.

---

### Task 1: Create Image Upload Component

**Files:**

- Create: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\components\inventory\ImageUpload.tsx`

**Step 1: Implement the UI with Dropzone and Thumbnail grid**

```typescript
import React, { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Progress } from "@/components/ui/progress";
import { X, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ urls, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newUrls = [...urls];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `products/temp/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(p);
          },
          (error) => reject(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              newUrls.push(url);
              resolve(url);
            });
          }
        );
      });
    }

    onChange(newUrls);
    setUploading(false);
    setProgress(0);
  };

  const removeImage = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {urls.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
            <img src={url} alt="Product" className="object-cover w-full h-full" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => removeImage(i)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {uploading && (
          <div className="aspect-square flex flex-col items-center justify-center border rounded-md bg-muted/50 p-2">
            <Progress value={progress} className="h-1 w-full" />
            <span className="text-[10px] mt-2">Uploading...</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
          </div>
          <input type="file" className="hidden" multiple onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add src/components/inventory/ImageUpload.tsx
git commit -m "feat: add ImageUpload component with Firebase Storage integration"
```

---

### Task 2: Integrate ImageUpload into AddProductForm

**Files:**

- Modify: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\components\inventory\AddProductForm.tsx`

**Step 1: Update form schema and fields**

- Add `imageUrls` to Zod schema.
- Add the `ImageUpload` component to the form render.

**Step 2: Commit**

```bash
git add src/components/inventory/AddProductForm.tsx
git commit -m "feat: connect image upload to product creation form"
```

---

### Task 3: Show Primary Image in Inventory Table

**Files:**

- Modify: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\pages\Inventory.tsx`

**Step 1: Update the Table row to show a thumbnail**

- Replace the "Box" icon with the first image in `imageUrls` if it exists.

**Step 2: Commit**

```bash
git add src/pages/Inventory.tsx
git commit -m "feat: display product thumbnails in inventory table"
```

---

### Task 4: Enhance Order Details with Images

**Files:**

- Modify: `c:\Users\user\OneDrive\Desktop\React\inventory-mgmt\src\components\orders\OrderDetailsDialog.tsx`

**Step 1: Add image thumbnails to the order items list**

- This helps verify stock during receipt.

**Step 2: Commit**

```bash
git add src/components/orders/OrderDetailsDialog.tsx
git commit -m "ui: show product images in order details"
```
