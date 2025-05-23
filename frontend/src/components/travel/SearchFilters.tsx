'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: FilterOption[];
  selectedPriceRange: string;
  onPriceRangeChange: (value: string) => void;
  priceRanges: FilterOption[];
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedPriceRange,
  onPriceRangeChange,
  priceRanges,
  onClearFilters,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <FontAwesomeIcon icon={faFilter} className="mr-2 text-green-600" />
        Filters
      </h2>
      
      {/* Search box */}
      <div className="mb-6">
        <label htmlFor="search" className="block mb-2 font-medium">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Location, activity, etc."
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      
      {/* Category filter */}
      <div className="mb-6">
        <label htmlFor="category" className="block mb-2 font-medium">
          Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Price range filter */}
      <div className="mb-6">
        <label htmlFor="price" className="block mb-2 font-medium">
          Price Range
        </label>
        <select
          id="price"
          value={selectedPriceRange}
          onChange={(e) => onPriceRangeChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Any Price</option>
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Clear filters button */}
      <button
        onClick={onClearFilters}
        className="w-full p-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default SearchFilters;