'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faSearch, 
  faTrash,
  faEdit,
  faPlus,
  faSave,
  faUpload,
  faImages,
  faFilter,
  faThLarge,
  faList,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/common';

// Mock data for initial development
const MOCK_IMAGES = [
  {
    id: "1",
    name: "Mountain View",
    category: "landscape",
    thumbnail: "/images/real/pexels-travelerchitect-18736328-min.jpg",
    url: "/images/real/pexels-travelerchitect-18736328-min.jpg",
    alt: "Mountain landscape with snow peaks",
    uploadedAt: new Date("2023-04-15"),
    size: "1.2MB",
    dimensions: "1920x1080",
    usedIn: ["listings", "homepage"],
  },
  {
    id: "2",
    name: "Backwater Houseboat",
    category: "accommodation",
    thumbnail: "/images/real/pexels-nans1419-20519339-min.jpg",
    url: "/images/real/pexels-nans1419-20519339-min.jpg",
    alt: "Traditional houseboat in Kerala backwaters",
    uploadedAt: new Date("2023-05-22"),
    size: "2.1MB",
    dimensions: "2048x1365",
    usedIn: ["listings"],
  },
  {
    id: "3",
    name: "Forest Trail",
    category: "adventure",
    thumbnail: "/images/real/pexels-dizitalboost-11622977-min.jpg",
    url: "/images/real/pexels-dizitalboost-11622977-min.jpg",
    alt: "Hiking trail through dense forest",
    uploadedAt: new Date("2023-03-10"),
    size: "1.8MB",
    dimensions: "1800x1200",
    usedIn: ["listings"],
  },
  {
    id: "4",
    name: "Riverside Camping",
    category: "adventure",
    thumbnail: "/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg",
    url: "/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg",
    alt: "Camping tents by a mountain river",
    uploadedAt: new Date("2023-06-05"),
    size: "1.5MB",
    dimensions: "1920x1280",
    usedIn: ["listings", "blog"],
  },
  {
    id: "5",
    name: "Mountain Village",
    category: "destination",
    thumbnail: "/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg",
    url: "/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg",
    alt: "Traditional village in the mountains",
    uploadedAt: new Date("2023-05-18"),
    size: "1.9MB",
    dimensions: "2000x1333",
    usedIn: ["blog"],
  },
  {
    id: "6",
    name: "Desert Safari",
    category: "adventure",
    thumbnail: "/images/real/pexels-kanishka-211910-679492-min.jpg",
    url: "/images/real/pexels-kanishka-211910-679492-min.jpg",
    alt: "Jeep safari in the desert",
    uploadedAt: new Date("2023-04-30"),
    size: "1.3MB",
    dimensions: "1800x1200",
    usedIn: ["listings"],
  },
  {
    id: "7",
    name: "Temple Architecture",
    category: "cultural",
    thumbnail: "/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg",
    url: "/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg",
    alt: "Ancient temple architecture",
    uploadedAt: new Date("2023-03-25"),
    size: "2.0MB",
    dimensions: "2048x1365",
    usedIn: ["blog"],
  },
  {
    id: "8",
    name: "Beach Sunset",
    category: "landscape",
    thumbnail: "/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg",
    url: "/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg",
    alt: "Sunset over a tropical beach",
    uploadedAt: new Date("2023-06-10"),
    size: "1.7MB",
    dimensions: "1920x1080",
    usedIn: ["homepage", "listings"],
  }
];

// Image categories
const IMAGE_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "landscape", label: "Landscapes" },
  { value: "accommodation", label: "Accommodations" },
  { value: "adventure", label: "Adventures" },
  { value: "destination", label: "Destinations" },
  { value: "cultural", label: "Cultural" },
  { value: "other", label: "Other" }
];

// Usage filters
const USAGE_FILTERS = [
  { value: "all", label: "All Usages" },
  { value: "listings", label: "Listings" },
  { value: "homepage", label: "Homepage" },
  { value: "blog", label: "Blog" },
  { value: "unused", label: "Unused" }
];

export default function ImageManagementPage() {
  const router = useRouter();
  
  // State for images
  const [allImages, setAllImages] = useState(MOCK_IMAGES);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [usageFilter, setUsageFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // State for image upload/edit
  const [uploadingImages, setUploadingImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  
  // Filtered images based on search and filters
  const filteredImages = allImages.filter(image => {
    // Apply search filter
    if (searchTerm && !image.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !image.alt.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (categoryFilter !== 'all' && image.category !== categoryFilter) {
      return false;
    }
    
    // Apply usage filter
    if (usageFilter !== 'all') {
      if (usageFilter === 'unused') {
        return image.usedIn.length === 0;
      } else {
        return image.usedIn.includes(usageFilter);
      }
    }
    
    return true;
  });
  
  // Sort images by upload date (newest first)
  const sortedImages = [...filteredImages].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
  
  // Fetch images (simulated)
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setAllImages(MOCK_IMAGES);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);
  
  // Handle image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to array and set state
      const filesArray = Array.from(e.target.files);
      setUploadingImages(filesArray);
      
      // Reset any previous errors
      setUploadError(null);
    }
  };
  
  // Handle upload submit
  const handleUpload = async () => {
    if (uploadingImages.length === 0) {
      setUploadError("Please select files to upload");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      for (let i = 1; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setUploadProgress(i * 10);
      }
      
      // Generate mock data for newly uploaded images
      const newImages = uploadingImages.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name.split('.')[0].replace(/[_-]/g, ' '),
        category: "other",
        // Use URL.createObjectURL in a real app we'd use the response from the server
        thumbnail: URL.createObjectURL(file),
        url: URL.createObjectURL(file),
        alt: file.name.split('.')[0].replace(/[_-]/g, ' '),
        uploadedAt: new Date(),
        size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        dimensions: "1920x1080", // This would come from the server
        usedIn: []
      }));
      
      // Add to existing images
      setAllImages(prev => [...newImages, ...prev]);
      
      // Reset upload state
      setUploadingImages([]);
      setUploadProgress(0);
      setUploadError(null);
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploadError("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle image edit
  const handleEdit = (image: any) => {
    setEditingImage({ ...image });
  };
  
  // Save edited image
  const handleSaveEdit = () => {
    if (!editingImage) return;
    
    // Validate fields
    if (!editingImage.name.trim() || !editingImage.alt.trim()) {
      alert("Name and alt text are required");
      return;
    }
    
    // Update image in state
    setAllImages(prev => 
      prev.map(img => 
        img.id === editingImage.id ? editingImage : img
      )
    );
    
    // Close edit mode
    setEditingImage(null);
  };
  
  // Delete image
  const handleDelete = (id: string) => {
    // Check if image is in use
    const image = allImages.find(img => img.id === id);
    
    if (image && image.usedIn.length > 0) {
      const usageStr = image.usedIn.join(", ");
      if (!window.confirm(`This image is currently used in: ${usageStr}. Deleting it may break these pages. Are you sure you want to continue?`)) {
        return;
      }
    } else {
      if (!window.confirm("Are you sure you want to delete this image?")) {
        return;
      }
    }
    
    // Delete image
    setAllImages(prev => prev.filter(img => img.id !== id));
  };
  
  // Cancel edit
  const handleCancelEdit = () => {
    setEditingImage(null);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Image Management</h1>
        
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
          
          {/* Upload section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Upload New Images</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="imageUpload"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUpload} className="text-gray-500 text-3xl" />
                    <span className="text-gray-700">Drag images here or click to browse</span>
                    <span className="text-sm text-gray-500">JPG, PNG, WebP up to 5MB</span>
                  </label>
                </div>
                
                {uploadingImages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
                    <ul className="text-sm text-gray-600">
                      {uploadingImages.map((file, index) => (
                        <li key={index} className="truncate">
                          {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {uploadError && (
                  <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-md">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                    {uploadError}
                  </div>
                )}
              </div>
              
              <div>
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <h3 className="text-sm font-medium mb-2">Before uploading:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Optimize images for web (JPEG/WebP format recommended)</li>
                    <li>Maximum file size is 5MB per image</li>
                    <li>Recommended minimum dimensions: 1200px width</li>
                    <li>Use descriptive filenames without special characters</li>
                  </ul>
                </div>
                
                <button
                  onClick={handleUpload}
                  disabled={isUploading || uploadingImages.length === 0}
                  className={`w-full py-3 rounded-md flex items-center justify-center ${
                    isUploading || uploadingImages.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} className="mr-2" />
                      Upload {uploadingImages.length} Image{uploadingImages.length !== 1 ? "s" : ""}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Filters and image library */}
          {editingImage ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Edit Image</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image Preview
                    </label>
                    <div className="relative h-60 w-full rounded-lg overflow-hidden">
                      <Image
                        src={editingImage.url}
                        alt={editingImage.alt}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {editingImage.dimensions} • {editingImage.size} • Uploaded on {formatDate(editingImage.uploadedAt)}
                    </p>
                  </div>
                  
                  {editingImage.usedIn.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-md text-sm">
                      <span className="font-medium">This image is used in: </span>
                      {editingImage.usedIn.join(", ")}
                    </div>
                  )}
                </div>
                
                <div>
                  {/* Image name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image Name *
                    </label>
                    <input
                      type="text"
                      value={editingImage.name}
                      onChange={(e) => setEditingImage({...editingImage, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter image name"
                      required
                    />
                  </div>
                  
                  {/* Alt text */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alt Text * (for accessibility)
                    </label>
                    <input
                      type="text"
                      value={editingImage.alt}
                      onChange={(e) => setEditingImage({...editingImage, alt: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe the image for screen readers"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Provide a brief description of the image for accessibility purposes
                    </p>
                  </div>
                  
                  {/* Category */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editingImage.category}
                      onChange={(e) => setEditingImage({...editingImage, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {IMAGE_CATEGORIES.filter(cat => cat.value !== 'all').map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search images..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      {IMAGE_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <select
                      value={usageFilter}
                      onChange={(e) => setUsageFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      {USAGE_FILTERS.map(filter => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {sortedImages.length} image{sortedImages.length !== 1 ? 's' : ''} found
                    </div>
                    
                    <div className="flex">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${
                          viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'
                        } rounded-l-md border border-gray-300`}
                        title="Grid View"
                      >
                        <FontAwesomeIcon icon={faThLarge} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${
                          viewMode === 'list' ? 'bg-gray-200' : 'bg-white'
                        } rounded-r-md border border-gray-300 border-l-0`}
                        title="List View"
                      >
                        <FontAwesomeIcon icon={faList} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image library */}
              {loading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-green-600 text-3xl mb-4" />
                  <p>Loading images...</p>
                </div>
              ) : sortedImages.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <FontAwesomeIcon icon={faImages} className="text-gray-400 text-5xl mb-4" />
                  <p className="text-gray-500 mb-4">No images found</p>
                  <p className="text-sm text-gray-500">
                    {searchTerm || categoryFilter !== 'all' || usageFilter !== 'all' 
                      ? "Try adjusting your search filters"
                      : "Upload some images to get started"}
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                // Grid view
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sortedImages.map(image => (
                    <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                        {image.usedIn.length > 0 && (
                          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                            In use
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate">{image.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{formatDate(image.uploadedAt)}</p>
                        
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleEdit(image)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List view
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedImages.map(image => (
                        <tr key={image.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative h-16 w-24 rounded overflow-hidden">
                              <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-sm">{image.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{image.dimensions} • {image.size}</div>
                            <div className="text-xs text-gray-500 mt-1">Uploaded: {formatDate(image.uploadedAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {image.usedIn.length > 0 ? (
                              <div>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                  In use
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                  {image.usedIn.join(", ")}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">Not used</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleEdit(image)}
                              className="text-blue-600 hover:text-blue-800 mr-3"
                            >
                              <FontAwesomeIcon icon={faEdit} className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(image.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-1" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
    </FadeIn>
  );
}