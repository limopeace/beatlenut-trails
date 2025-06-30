'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, 
  faFileAlt, 
  faDownload, 
  faEye, 
  faTimes,
  faExpand,
  faUser,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

interface MediaFile {
  url: string;
  type: 'image' | 'document';
  name: string;
  description?: string;
}

interface MediaGalleryProps {
  files: {
    profileImage?: string;
    logoImage?: string;
    identityProof?: string;
    serviceProof?: string;
    businessProof?: string;
    verificationDocument?: string;
  };
  className?: string;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ files, className = '' }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const mediaItems: { key: string; file: MediaFile; icon: any; label: string }[] = [];

  // Helper function to get proper file URL
  const getFileUrl = (filePath?: string) => {
    if (!filePath) return '';
    // If it's already a full URL, return as is
    if (filePath.startsWith('http')) return filePath;
    // Remove any leading slash or 'uploads/' prefix to avoid double path
    const cleanPath = filePath.replace(/^\/?(uploads\/)?/, '');
    // Construct the URL with backend server serving files at /uploads
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads/${cleanPath}`;
  };

  // Helper function to determine if file is an image
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  // Helper function to get file extension
  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toUpperCase() || 'FILE';
  };

  // Add files to media items
  if (files.profileImage && files.profileImage !== 'pending-upload') {
    const fileUrl = getFileUrl(files.profileImage);
    mediaItems.push({
      key: 'profileImage',
      file: {
        url: fileUrl,
        type: isImage(fileUrl) ? 'image' : 'document',
        name: 'Profile Image',
        description: 'Seller profile photo'
      },
      icon: faUser,
      label: 'Profile Image'
    });
  }

  if (files.logoImage && files.logoImage !== 'pending-upload') {
    const fileUrl = getFileUrl(files.logoImage);
    mediaItems.push({
      key: 'logoImage',
      file: {
        url: fileUrl,
        type: isImage(fileUrl) ? 'image' : 'document',
        name: 'Business Logo',
        description: 'Business logo or brand image'
      },
      icon: faBuilding,
      label: 'Business Logo'
    });
  }

  if (files.identityProof && files.identityProof !== 'pending-upload') {
    const fileUrl = getFileUrl(files.identityProof);
    mediaItems.push({
      key: 'identityProof',
      file: {
        url: fileUrl,
        type: isImage(fileUrl) ? 'image' : 'document',
        name: 'Identity Proof',
        description: 'Government issued ID document'
      },
      icon: faFileAlt,
      label: 'Identity Proof'
    });
  }

  if (files.serviceProof && files.serviceProof !== 'pending-upload') {
    const fileUrl = getFileUrl(files.serviceProof);
    mediaItems.push({
      key: 'serviceProof',
      file: {
        url: fileUrl,
        type: isImage(fileUrl) ? 'image' : 'document',
        name: 'Service Proof',
        description: 'Military service documentation'
      },
      icon: faFileAlt,
      label: 'Service Proof'
    });
  }

  if (files.businessProof && files.businessProof !== 'pending-upload') {
    const fileUrl = getFileUrl(files.businessProof);
    mediaItems.push({
      key: 'businessProof',
      file: {
        url: fileUrl,
        type: isImage(fileUrl) ? 'image' : 'document',
        name: 'Business Proof',
        description: 'Business registration documents'
      },
      icon: faFileAlt,
      label: 'Business Proof'
    });
  }

  if (files.verificationDocument && files.verificationDocument !== 'pending-upload') {
    const fileUrl = getFileUrl(files.verificationDocument);
    mediaItems.push({
      key: 'verificationDocument',
      file: {
        url: fileUrl,
        type: isImage(fileUrl) ? 'image' : 'document',
        name: 'Verification Document',
        description: 'Additional verification documents'
      },
      icon: faFileAlt,
      label: 'Verification Document'
    });
  }

  const handleImageClick = (url: string) => {
    if (isImage(url)) {
      setSelectedImage(url);
    } else {
      // Open document in new tab
      window.open(url, '_blank');
    }
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (mediaItems.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <FontAwesomeIcon icon={faImage} className="text-gray-400 text-2xl mb-2" />
        <p className="text-gray-500 text-sm">No media files uploaded</p>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents & Media</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediaItems.map(({ key, file, icon, label }) => (
            <div key={key} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {file.type === 'image' ? (
                <div className="relative group">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => handleImageClick(file.url)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => handleImageClick(file.url)}
                        className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100"
                        title="View full size"
                      >
                        <FontAwesomeIcon icon={faExpand} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(file.url, file.name)}
                        className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100"
                        title="Download"
                      >
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <FontAwesomeIcon icon={faFileAlt} className="text-gray-400 text-3xl mb-2" />
                    <p className="text-xs text-gray-500">{getFileExtension(file.url)}</p>
                  </div>
                </div>
              )}
              
              <div className="p-3">
                <div className="flex items-center mb-1">
                  <FontAwesomeIcon icon={icon} className="text-blue-600 w-4 h-4 mr-2" />
                  <h4 className="font-medium text-sm text-gray-900">{label}</h4>
                </div>
                
                {file.description && (
                  <p className="text-xs text-gray-500 mb-2">{file.description}</p>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleImageClick(file.url)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(file.url, file.name)}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
                  >
                    <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 z-10"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
            <img
              src={selectedImage}
              alt="Full size view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;