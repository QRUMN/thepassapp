import React, { useRef } from 'react';
import { uploadProfileImage } from '@/utils/firebase/profile';

interface ImageUploadProps {
  userId: string;
  currentImage: string;
  onUploadComplete: (url: string) => void;
  isEditing: boolean;
}

export default function ImageUpload({
  userId,
  currentImage,
  onUploadComplete,
  isEditing,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadProfileImage(userId, file);
      onUploadComplete(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      // TODO: Add proper error handling
    }
  };

  return (
    <div className="relative">
      <img
        src={currentImage || '/images/default-avatar.jpg'}
        alt="Profile"
        className={`h-48 w-full object-cover md:w-48 ${
          isEditing ? 'cursor-pointer hover:opacity-75' : ''
        }`}
        onClick={handleImageClick}
      />
      {isEditing && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-sm">Click to change image</span>
          </div>
        </>
      )}
    </div>
  );
}
