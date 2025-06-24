'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

export default function ImageUploader({ onImageSelect, currentImage }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Convert to base64 for immediate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPreview(base64);
      };
      reader.readAsDataURL(file);

      // Upload to a free image hosting service
      const formData = new FormData();
      formData.append('image', file);

      // Using imgbb.com free API (you can get a free API key)
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onImageSelect(data.imageUrl);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlInput = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setPreview(url);
      onImageSelect(url);
    }
  };

  const removeImage = () => {
    setPreview('');
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Featured Image
      </label>
      
      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Options */}
      <div className="flex flex-wrap gap-3">
        {/* File Upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                📷 Upload Image
              </>
            )}
          </label>
        </div>

        {/* URL Input */}
        <button
          type="button"
          onClick={handleUrlInput}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          🔗 Image URL
        </button>

        {/* Stock Photos */}
        <button
          type="button"
          onClick={() => {
            const stockImages = [
              'https://images.unsplash.com/photo-1566746064867-27d21b74b4dc', // Travel truck
              'https://images.unsplash.com/photo-1494412519320-aa613df615a2', // Travel services
              'https://images.unsplash.com/photo-1623000751975-571d6e8abfcf', // Tourism
              'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088', // Adventure
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', // Travel destinations
            ];
            const randomImage = stockImages[Math.floor(Math.random() * stockImages.length)];
            setPreview(randomImage);
            onImageSelect(randomImage);
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          🎲 Random Stock Photo
        </button>
      </div>

      {/* Upload Instructions */}
      <div className="text-sm text-gray-500">
        <p>Choose from:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li><strong>Upload Image:</strong> Upload from your computer (max 5MB)</li>
          <li><strong>Image URL:</strong> Use an existing image URL</li>
          <li><strong>Stock Photo:</strong> Get a random travel-related image</li>
        </ul>
      </div>
    </div>
  );
}