import React from "react";
interface ImageUploadProps {
    urls: string[];
    onChange: (urls: string[]) => void;
}
export declare const ImageUpload: React.FC<ImageUploadProps>;
export {};
