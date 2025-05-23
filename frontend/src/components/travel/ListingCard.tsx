'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faLocationDot, faTag } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/common';

interface Listing {
  id: string;
  title: string;
  slug: string;
  location: {
    city: string;
    country: string;
  };
  category: string;
  price: {
    amount: number;
    currency: string;
    priceType: string;
  };
  images: string[];
  reviews?: {
    average: number;
    count: number;
  };
  summary?: string;
}

interface ListingCardProps {
  listing: Listing;
  onViewDetails: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onViewDetails }) => {
  const formatPrice = (price: { amount: number; currency: string; priceType: string }) => {
    const currencySymbol = price.currency === 'INR' ? '₹' : price.currency;
    let priceLabel = '';
    
    switch (price.priceType) {
      case 'per_person':
        priceLabel = 'per person';
        break;
      case 'per_night':
        priceLabel = 'per night';
        break;
      case 'total':
        priceLabel = 'total';
        break;
      default:
        priceLabel = '';
    }
    
    // Format the number with commas for Indian numbering system
    const formattedAmount = price.amount.toLocaleString('en-IN');
    
    return `${currencySymbol}${formattedAmount} ${priceLabel}`;
  };
  
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  };
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative flex flex-col h-full"
      onClick={onViewDetails}
    >
      {/* Image */}
      <div className="relative h-40 xs:h-44 sm:h-48 w-full">
        <img
          src={listing.images[0] || '/images/placeholder.jpg'}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category tag */}
        <div className="absolute top-3 right-3 bg-forest-green text-white text-xs uppercase font-bold px-2 py-1 rounded-sm z-10">
          {formatCategory(listing.category)}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-deep-forest line-clamp-1 font-clash">{listing.title}</h3>
        
        {/* Location */}
        <div className="flex items-center text-deep-forest/70 mb-1.5 sm:mb-2 text-sm sm:text-base">
          <FontAwesomeIcon icon={faLocationDot} className="mr-1.5 sm:mr-2 text-forest-green" />
          <span>{listing.location.city}, {listing.location.country}</span>
        </div>
        
        {/* Reviews */}
        {listing.reviews && (
          <div className="flex items-center mb-1.5 sm:mb-2 text-sm">
            <div className="flex items-center mr-1.5 sm:mr-2">
              <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
              <span className="font-bold">{listing.reviews.average.toFixed(1)}</span>
            </div>
            <span className="text-deep-forest/70 text-xs sm:text-sm">({listing.reviews.count} reviews)</span>
          </div>
        )}
        
        {/* Summary */}
        {listing.summary && (
          <p className="text-deep-forest/70 mb-3 text-xs sm:text-sm line-clamp-2 flex-grow">{listing.summary}</p>
        )}
        
        {/* Price and CTA */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-deep-forest/70 text-xs">From</span>
            <span className="font-bold text-base sm:text-lg text-forest-green">{formatPrice(listing.price)}</span>
          </div>
          <div 
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click from triggering
              onViewDetails();
            }}
          >
            <Button className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5">
              View Details
            </Button>
          </div>
        </div>
      </div>
      
      {/* Add a full overlay to improve clickability */}
      <div className="absolute inset-0 z-0 transition-opacity opacity-0 hover:opacity-10 bg-forest-green"></div>
    </div>
  );
};

export default ListingCard;