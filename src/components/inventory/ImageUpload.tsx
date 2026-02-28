import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { X, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Cloudinary unsigned upload — no server needed, no Firebase Storage required.
// Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface ImageUploadProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ urls, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = CLOUD_NAME && UPLOAD_PRESET;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!isConfigured) {
      setError(
        "Cloudinary is not configured. See docs/FIREBASE_SETUP.md for setup instructions.",
      );
      return;
    }

    setUploading(true);
    setError(null);
    const newUrls = [...urls];
    const total = files.length;

    for (let i = 0; i < total; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 5 MB limit and was skipped.`);
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "stockflow/products");

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData },
        );

        if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);

        const data = await res.json();
        newUrls.push(data.secure_url as string);
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        setError("One or more images failed to upload. Please try again.");
      }

      // Update progress per file
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    onChange(newUrls);
    setUploading(false);
    setProgress(0);
    // Reset the input so the same file can be re-selected if needed
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      {/* Image Previews */}
      {urls.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {urls.map((url, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-md overflow-hidden border bg-muted group"
            >
              <img
                src={url}
                alt={`Product image ${i + 1}`}
                className="object-cover w-full h-full"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(i)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploading to Cloudinary...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Not Configured Warning */}
      {!isConfigured && (
        <div className="flex items-start gap-2 rounded-md border border-amber-300/40 bg-amber-50/50 dark:bg-amber-900/10 p-3 text-xs text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Image uploads are not yet configured. Add{" "}
            <code className="font-mono font-bold">
              VITE_CLOUDINARY_CLOUD_NAME
            </code>{" "}
            and{" "}
            <code className="font-mono font-bold">
              VITE_CLOUDINARY_UPLOAD_PRESET
            </code>{" "}
            to your <code className="font-mono">.env</code> file. See{" "}
            <strong>docs/FIREBASE_SETUP.md</strong> for instructions.
          </span>
        </div>
      )}

      {/* Drop Zone */}
      <div className="flex items-center justify-center w-full">
        <label
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors
            ${
              uploading || !isConfigured
                ? "cursor-not-allowed opacity-60 border-muted-foreground/20 bg-muted/20"
                : "cursor-pointer border-muted-foreground/25 bg-muted/30 hover:bg-muted/50 hover:border-primary/40"
            }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-7 h-7 mb-2 text-muted-foreground" />
            <p className="mb-1 text-sm text-muted-foreground font-medium">
              {uploading ? "Uploading…" : "Click to upload product images"}
            </p>
            <p className="text-xs text-muted-foreground/60">
              PNG, JPG or WebP · Max 5 MB per image
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading || !isConfigured}
          />
        </label>
      </div>
    </div>
  );
};
