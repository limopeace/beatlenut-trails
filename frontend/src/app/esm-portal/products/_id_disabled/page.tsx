'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faLocationDot, 
  faUser,
  faCheck,
  faTimes,
  faArrowLeft,
  faChevronRight,
  faPhone,
  faEnvelope,
  faTag,
  faMedal,
  faShippingFast,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/common';
import Link from 'next/link';
import AddToCartButton from '@/components/marketplace/cart/AddToCartButton';

// Mock data for development
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Handcrafted Bamboo Art',
    price: '₹1,200',
    discountedPrice: '₹999',
    rating: 4.8,
    reviewCount: 35,
    description: 'Exquisitely handcrafted bamboo art pieces created by skilled ex-servicemen artisans. Each piece is a unique blend of traditional craftsmanship and contemporary design.\n\nOur bamboo art is not just a decorative item but a testament to the dedication and precision that our veteran artisans bring from their military background. Sustainable, eco-friendly, and created with attention to detail.\n\nThese bamboo crafts are perfect for home decor, office spaces, or as thoughtful gifts that support our ex-servicemen community.',
    seller: {
      name: 'Capt. Rajesh Singh (Retd.)',
      rank: 'Captain',
      service: 'Indian Army',
      yearsOfService: 22,
      location: 'Shillong, Meghalaya',
      sellerSince: 'April 2021',
      about: 'After serving in the Indian Army for over two decades, I turned my hobby of bamboo crafting into a full-time passion. Each piece is created with the same dedication and precision that guided my military career.',
      ratings: 4.9,
      totalSales: 156,
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'rajesh.singh@example.com'
      },
      verifiedSeller: true
    },
    categories: ['Handicrafts', 'Home Decor', 'Sustainable Products'],
    images: [
      'https://picsum.photos/id/119/800/500',
      'https://picsum.photos/id/225/800/500',
      'https://picsum.photos/id/175/800/500',
    ],
    highlights: [
      'Handcrafted by ex-servicemen',
      'Eco-friendly sustainable materials',
      'Each piece is unique and one-of-a-kind'
    ],
    specifications: [
      { name: 'Material', value: '100% Natural Bamboo' },
      { name: 'Dimensions', value: 'Varies by piece (10-20 inches)' },
      { name: 'Weight', value: '300-500 grams' },
      { name: 'Finish', value: 'Natural polish with eco-friendly varnish' },
      { name: 'Origin', value: 'Meghalaya, Northeast India' }
    ],
    shipping: {
      freeShipping: true,
      estimatedDelivery: '4-6 business days',
      returnPolicy: '15-day return policy for manufacturing defects'
    },
    userReviews: [
      {
        id: 1,
        name: 'Amit Kumar',
        rating: 5,
        date: '2023-06-15',
        comment: 'Absolutely beautiful craftsmanship! The bamboo art piece I received has become the focal point of my living room. Can really see the dedication and skill that went into creating it.'
      },
      {
        id: 2,
        name: 'Priya Singh',
        rating: 4,
        date: '2023-05-22',
        comment: 'Gorgeous piece with excellent attention to detail. Shipping was fast and the packaging was very secure. Would have given 5 stars but there was a tiny imperfection in the finish.'
      },
      {
        id: 3,
        name: 'Ravi Patel',
        rating: 5,
        date: '2023-04-10',
        comment: 'Not only is the bamboo art beautiful, but knowing it was made by an ex-serviceman makes it even more special. Great quality and unique design!'
      }
    ],
    relatedProducts: [2, 3, 4]
  },
  {
    id: '2',
    name: 'Organic Tea Collection',
    price: '₹850',
    discountedPrice: null,
    rating: 4.6,
    reviewCount: 42,
    description: 'Premium organic tea collection grown and processed by ex-servicemen farmers in the lush hills of Darjeeling and Assam. This exclusive collection includes a variety of black, green, and white teas handpicked from our veteran-owned tea estates.\n\nEach tea in this collection is carefully cultivated using sustainable farming practices. Our ex-servicemen farmers bring the same discipline and attention to detail from their military service to their tea plantations.\n\nThis collection makes for a perfect gift for tea enthusiasts or a premium addition to your own tea selection.',
    seller: {
      name: 'Maj. Anand Kumar (Retd.)',
      rank: 'Major',
      service: 'Indian Army',
      yearsOfService: 18,
      location: 'Darjeeling, West Bengal',
      sellerSince: 'June 2020',
      about: 'After serving in the Indian Army, I returned to my family tradition of tea cultivation. Our tea gardens in Darjeeling are managed with the same precision and care that I learned during my military career.',
      ratings: 4.7,
      totalSales: 243,
      contactInfo: {
        phone: '+91 98765 12345',
        email: 'anand.kumar@example.com'
      },
      verifiedSeller: true
    },
    categories: ['Food Products', 'Organic', 'Beverages'],
    images: [
      'https://picsum.photos/id/431/800/500',
      'https://picsum.photos/id/493/800/500',
      'https://picsum.photos/id/442/800/500',
    ],
    highlights: [
      'Grown and harvested by ex-servicemen farmers',
      '100% organic certification',
      'Premium quality teas from Darjeeling and Assam'
    ],
    specifications: [
      { name: 'Contents', value: 'Assorted Black, Green, and White Teas' },
      { name: 'Weight', value: '250g (50g x 5 varieties)' },
      { name: 'Packaging', value: 'Eco-friendly packaging with moisture barrier' },
      { name: 'Origin', value: 'Darjeeling and Assam, India' },
      { name: 'Shelf Life', value: '18 months from packaging date' }
    ],
    shipping: {
      freeShipping: true,
      estimatedDelivery: '3-5 business days',
      returnPolicy: '7-day return policy for unopened products'
    },
    userReviews: [
      {
        id: 1,
        name: 'Sunita Sharma',
        rating: 5,
        date: '2023-07-12',
        comment: 'The aroma and flavor of these teas are exceptional! I especially loved the Darjeeling first flush. Will definitely be ordering again.'
      },
      {
        id: 2,
        name: 'Karan Malhotra',
        rating: 4,
        date: '2023-06-28',
        comment: 'Great variety and quality. The packaging is beautiful and would make for a wonderful gift. I would have liked more detailed brewing instructions though.'
      },
      {
        id: 3,
        name: 'Meera Joshi',
        rating: 5,
        date: '2023-05-15',
        comment: 'As a tea connoisseur, I can say this is some of the finest tea I have had. The fact that it supports our veterans makes it even more special!'
      }
    ],
    relatedProducts: [1, 3, 4]
  }
];

// Component for star rating
function StarRating({ rating, size = 'md' }) {
  const sizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className={`${sizeClass[size]} ${i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}`} 
          />
        ))}
      </div>
      {rating > 0 && (
        <span className={`ml-1 font-medium ${sizeClass[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  // Find product by id
  const product = MOCK_PRODUCTS.find(item => item.id === id);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('description');
  
  // State for image gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const handleBackClick = () => {
    router.back();
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-pale-straw pt-24">
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-deep-forest">Product Not Found</h1>
            <p className="mb-8 text-deep-forest/70">The product you are looking for does not exist or has been removed.</p>
            <Button 
              onClick={() => router.push('/esm-portal/products')}
              className="bg-forest-green hover:bg-forest-green/90 text-white font-bold py-3 px-6 rounded"
            >
              Back to Products
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-pale-straw pt-24">
      <main className="flex-grow">
        <FadeIn>
          {/* Image gallery */}
          <div className="relative">
            <div className="relative h-[60vh] min-h-[350px] md:h-[70vh] md:min-h-[450px] w-full bg-pale-straw/50">
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              
              {/* Image counter overlay */}
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-deep-forest/70 text-pale-straw px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {activeImageIndex + 1} / {product.images.length}
              </div>
              
              {/* Navigation arrows */}
              <button
                onClick={() => setActiveImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 sm:p-3 rounded-full text-deep-forest transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <FontAwesomeIcon icon={faChevronRight} className="rotate-180 text-xs sm:text-sm" />
              </button>
              <button
                onClick={() => setActiveImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 sm:p-3 rounded-full text-deep-forest transition-all hover:scale-110"
                aria-label="Next image"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-xs sm:text-sm" />
              </button>
              
              {/* Back button */}
              <button
                onClick={handleBackClick}
                className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full text-deep-forest transition-colors hover:text-forest-green"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs sm:text-sm" />
              </button>
            </div>
            
            {/* Thumbnails - visible on all screens but with different styles */}
            <div className="container mx-auto px-4 -mt-8 sm:-mt-10 md:-mt-12 relative z-10">
              <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 flex space-x-2 sm:space-x-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 ${
                      activeImageIndex === index 
                        ? 'border-forest-green shadow-md scale-105' 
                        : 'border-transparent hover:border-moss-green'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            {/* Product Header */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              {/* Breadcrumbs */}
              <div className="text-xs sm:text-sm text-deep-forest/70 mb-3 sm:mb-4 overflow-x-auto whitespace-nowrap">
                <Link href="/" className="hover:text-forest-green">Home</Link> &gt; 
                <Link href="/esm-portal" className="hover:text-forest-green"> ESM Portal</Link> &gt; 
                <Link href="/esm-portal/products" className="hover:text-forest-green"> Products</Link> &gt; 
                <span className="text-deep-forest"> {product.name}</span>
              </div>
              
              {/* Title, Price, and Reviews */}
              <div className="mb-3 sm:mb-4">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-forest font-clash">{product.name}</h1>
                  <div className="flex flex-col items-end">
                    {product.discountedPrice ? (
                      <>
                        <span className="text-lg sm:text-xl font-bold text-forest-green">{product.discountedPrice}</span>
                        <span className="text-sm line-through text-deep-forest/50">{product.price}</span>
                      </>
                    ) : (
                      <span className="text-lg sm:text-xl font-bold text-forest-green">{product.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center">
                    <StarRating rating={product.rating} />
                    <span className="ml-1 text-deep-forest/70 text-xs sm:text-sm">({product.reviewCount} reviews)</span>
                  </div>
                  
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category, index) => (
                      <span 
                        key={index} 
                        className="bg-moss-green/20 text-deep-forest text-xs px-2 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Seller quick info */}
              <div className="flex flex-wrap items-center justify-between border-t border-pale-straw/30 pt-3 sm:pt-4 mt-3 sm:mt-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-moss-green/20 rounded-full mr-3 flex-shrink-0">
                    <FontAwesomeIcon icon={faUser} className="text-forest-green" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-deep-forest">{product.seller.name}</p>
                    <p className="text-xs text-deep-forest/70">{product.seller.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {product.seller.verifiedSeller && (
                    <div className="flex items-center bg-pale-straw px-2 py-1 rounded-full mr-3">
                      <FontAwesomeIcon icon={faMedal} className="text-forest-green mr-1 text-xs" />
                      <span className="text-xs text-deep-forest font-medium">Verified Seller</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {/* Left column - Product details */}
              <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                {/* Tabs navigation */}
                <div className="border-b border-gray-200 mb-4 sm:mb-6">
                  <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`py-2 sm:py-4 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'description'
                          ? 'border-forest-green text-forest-green'
                          : 'border-transparent text-deep-forest/70 hover:text-deep-forest hover:border-moss-green'
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab('specifications')}
                      className={`py-2 sm:py-4 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'specifications'
                          ? 'border-forest-green text-forest-green'
                          : 'border-transparent text-deep-forest/70 hover:text-deep-forest hover:border-moss-green'
                      }`}
                    >
                      Specifications
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`py-2 sm:py-4 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'reviews'
                          ? 'border-forest-green text-forest-green'
                          : 'border-transparent text-deep-forest/70 hover:text-deep-forest hover:border-moss-green'
                      }`}
                    >
                      Reviews
                    </button>
                    <button
                      onClick={() => setActiveTab('seller')}
                      className={`py-2 sm:py-4 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'seller'
                          ? 'border-forest-green text-forest-green'
                          : 'border-transparent text-deep-forest/70 hover:text-deep-forest hover:border-moss-green'
                      }`}
                    >
                      About Seller
                    </button>
                  </nav>
                </div>
                
                {/* Tab content */}
                {activeTab === 'description' && (
                  <div>
                    {/* Description */}
                    <div className="mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-deep-forest font-clash">Product Description</h2>
                      <div className="prose max-w-none text-deep-forest/80 text-sm sm:text-base leading-relaxed">
                        {product.description.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-3 sm:mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    
                    {/* Highlights */}
                    <div className="mb-6 sm:mb-8 bg-pale-straw p-4 sm:p-5 rounded-lg">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-deep-forest font-clash">Highlights</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {product.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <FontAwesomeIcon icon={faCheck} className="mt-0.5 sm:mt-1 mr-2 sm:mr-3 text-forest-green text-sm sm:text-base" />
                            <span className="text-deep-forest/90 font-medium text-sm sm:text-base">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Shipping Information */}
                    <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-5 rounded-lg border border-pale-straw">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-deep-forest font-clash">Shipping Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center text-center p-3 bg-pale-straw/40 rounded-lg">
                          <FontAwesomeIcon icon={faShippingFast} className="text-forest-green text-xl mb-2" />
                          <h3 className="font-medium text-deep-forest text-sm">{product.shipping.freeShipping ? 'Free Shipping' : 'Standard Shipping'}</h3>
                        </div>
                        <div className="flex flex-col items-center text-center p-3 bg-pale-straw/40 rounded-lg">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-forest-green text-xl mb-2" />
                          <h3 className="font-medium text-deep-forest text-sm">Delivery in {product.shipping.estimatedDelivery}</h3>
                        </div>
                        <div className="flex flex-col items-center text-center p-3 bg-pale-straw/40 rounded-lg">
                          <FontAwesomeIcon icon={faHandshake} className="text-forest-green text-xl mb-2" />
                          <h3 className="font-medium text-deep-forest text-sm">{product.shipping.returnPolicy}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-deep-forest font-clash">Product Specifications</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-pale-straw/40 rounded-lg overflow-hidden">
                        <tbody>
                          {product.specifications.map((spec, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-pale-straw/20" : ""}>
                              <td className="py-3 px-4 font-medium text-deep-forest border-b border-pale-straw/30 whitespace-nowrap text-sm sm:text-base">{spec.name}</td>
                              <td className="py-3 px-4 text-deep-forest/80 border-b border-pale-straw/30 text-sm sm:text-base">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-semibold text-deep-forest font-clash">Customer Reviews</h2>
                      <div className="flex items-center bg-moss-green/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full self-start sm:self-auto">
                        <StarRating rating={product.rating} size="lg" />
                        <span className="ml-1 text-deep-forest font-medium text-xs sm:text-sm">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      {product.userReviews.map(review => (
                        <div key={review.id} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-pale-straw/30">
                          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 mb-2 sm:mb-3">
                            <div>
                              <h3 className="font-medium text-deep-forest text-sm sm:text-base">{review.name}</h3>
                              <p className="text-xs sm:text-sm text-deep-forest/50">{review.date}</p>
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-deep-forest/70 text-xs sm:text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-5 sm:mt-6 text-center">
                      <Button className="bg-forest-green hover:bg-forest-green/90 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm">
                        View All {product.reviewCount} Reviews
                      </Button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'seller' && (
                  <div>
                    <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                      <div className="md:w-1/3 flex flex-col items-center text-center p-5 bg-pale-straw/30 rounded-lg">
                        <div className="w-20 h-20 rounded-full bg-moss-green/30 flex items-center justify-center mb-3">
                          <FontAwesomeIcon icon={faUser} className="text-forest-green text-xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-deep-forest mb-1">{product.seller.name}</h3>
                        <p className="text-forest-green mb-3 text-sm">{product.seller.rank} (Retd.), {product.seller.service}</p>
                        <div className="flex items-center justify-center mb-2">
                          <StarRating rating={product.seller.ratings} />
                          <span className="ml-1 text-deep-forest/70 text-xs">Seller Rating</span>
                        </div>
                        <p className="text-xs text-deep-forest/70 mb-1">Seller since: {product.seller.sellerSince}</p>
                        <p className="text-xs text-deep-forest/70 mb-3">Total sales: {product.seller.totalSales}</p>
                        {product.seller.verifiedSeller && (
                          <div className="flex items-center bg-forest-green/20 px-2 py-1 rounded-full mb-3">
                            <FontAwesomeIcon icon={faMedal} className="text-forest-green mr-1 text-xs" />
                            <span className="text-xs text-deep-forest font-medium">Verified ESM Seller</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-2/3">
                        <h3 className="text-lg font-semibold text-deep-forest mb-3">About the Seller</h3>
                        <p className="text-deep-forest/80 text-sm mb-6">{product.seller.about}</p>
                        
                        <h3 className="text-lg font-semibold text-deep-forest mb-3">Service Background</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-pale-straw/30 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-deep-forest/70 mb-1">Service Branch</h4>
                            <p className="text-sm text-deep-forest">{product.seller.service}</p>
                          </div>
                          <div className="bg-pale-straw/30 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-deep-forest/70 mb-1">Years of Service</h4>
                            <p className="text-sm text-deep-forest">{product.seller.yearsOfService} years</p>
                          </div>
                          <div className="bg-pale-straw/30 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-deep-forest/70 mb-1">Last Rank Held</h4>
                            <p className="text-sm text-deep-forest">{product.seller.rank}</p>
                          </div>
                          <div className="bg-pale-straw/30 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-deep-forest/70 mb-1">Location</h4>
                            <p className="text-sm text-deep-forest">{product.seller.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <Button className="flex-1 bg-forest-green hover:bg-forest-green/90 text-pale-straw py-2 px-4 rounded text-sm flex items-center justify-center">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            Message Seller
                          </Button>
                          <Button className="flex-1 border border-forest-green text-forest-green hover:bg-forest-green/10 py-2 px-4 rounded text-sm flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right column - Contact seller card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md sticky top-24">
                  {/* Contact seller header */}
                  <div className="bg-forest-green text-white p-3 sm:p-4 rounded-t-lg">
                    <h3 className="text-lg sm:text-xl font-bold font-clash">Get In Touch With Seller</h3>
                    <p className="text-xs sm:text-sm">Direct inquiry for this product</p>
                  </div>
                  
                  {/* Contact seller body */}
                  <div className="p-4 sm:p-5 md:p-6">
                    {/* Price information */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6 pb-4 border-b border-pale-straw/30">
                      <div>
                        <span className="text-xs text-deep-forest/60">Price:</span>
                        {product.discountedPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-forest-green">{product.discountedPrice}</span>
                            <span className="text-sm line-through text-deep-forest/50">{product.price}</span>
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-forest-green">{product.price}</div>
                        )}
                      </div>
                      {product.shipping.freeShipping && (
                        <div className="bg-pale-straw px-2 py-1 rounded text-xs text-deep-forest font-medium">
                          Free Shipping
                        </div>
                      )}
                    </div>
                    
                    {/* Message form */}
                    <div className="mb-4 sm:mb-6">
                      <label htmlFor="inquiry" className="block text-sm font-medium text-deep-forest mb-2">
                        Your Inquiry
                      </label>
                      <textarea
                        id="inquiry"
                        rows={4}
                        placeholder="I'm interested in this product and would like to know more about..."
                        className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-white text-deep-forest text-sm"
                      ></textarea>
                    </div>
                    
                    <div className="mb-4 sm:mb-6">
                      <label htmlFor="name" className="block text-sm font-medium text-deep-forest mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-white text-deep-forest text-sm"
                      />
                    </div>
                    
                    <div className="mb-6 sm:mb-6">
                      <label htmlFor="contact" className="block text-sm font-medium text-deep-forest mb-2">
                        Contact Information
                      </label>
                      <input
                        type="text"
                        id="contact"
                        placeholder="Email or phone number"
                        className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-white text-deep-forest text-sm"
                      />
                    </div>
                    
                    {/* Add to Cart Button */}
                    <AddToCartButton
                      id={product.id}
                      type="product"
                      name={product.name}
                      price={parseFloat(product.discountedPrice?.replace('₹', '').replace(',', '') || product.price.replace('₹', '').replace(',', ''))}
                      imageUrl={product.images[0]}
                      sellerId={`seller-${product.seller.name.toLowerCase().replace(/\s+/g, '-')}`}
                      sellerName={product.seller.name}
                      options={[
                        { name: 'Size', values: ['Small', 'Medium', 'Large'] },
                        { name: 'Color', values: ['Natural', 'Brown', 'Black'] }
                      ]}
                      className="w-full mb-4"
                      buttonText="Add to Cart"
                    />
                    
                    <div className="flex justify-center">
                      <Button
                        className="w-full bg-forest-green hover:bg-forest-green/90 text-white font-bold py-2.5 sm:py-3 px-4 rounded text-sm sm:text-base"
                      >
                        Send Inquiry
                      </Button>
                    </div>
                    
                    {/* Contact options */}
                    <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-pale-straw/30">
                      <h4 className="text-sm font-semibold text-deep-forest mb-3">Or contact directly:</h4>
                      
                      <div className="space-y-3">
                        <a href={`tel:${product.seller.contactInfo.phone}`} className="flex items-center p-2 bg-pale-straw/20 rounded-lg hover:bg-pale-straw/40 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-forest-green/10 flex items-center justify-center mr-3">
                            <FontAwesomeIcon icon={faPhone} className="text-forest-green text-sm" />
                          </div>
                          <span className="text-sm text-deep-forest">{product.seller.contactInfo.phone}</span>
                        </a>
                        
                        <a href={`mailto:${product.seller.contactInfo.email}`} className="flex items-center p-2 bg-pale-straw/20 rounded-lg hover:bg-pale-straw/40 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-forest-green/10 flex items-center justify-center mr-3">
                            <FontAwesomeIcon icon={faEnvelope} className="text-forest-green text-sm" />
                          </div>
                          <span className="text-sm text-deep-forest">{product.seller.contactInfo.email}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Related Products */}
            <div className="mt-8 sm:mt-10 md:mt-12 bg-white rounded-lg shadow-md p-5 sm:p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-deep-forest font-clash">Related Products</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {MOCK_PRODUCTS.filter(item => item.id !== product.id).map((relatedProduct) => (
                  <div key={relatedProduct.id} className="card group h-full flex flex-col shadow-md transition-all hover:shadow-lg rounded-lg overflow-hidden">
                    <div className="relative h-36 sm:h-40 overflow-hidden">
                      <div className="absolute inset-0">
                        <img 
                          src={relatedProduct.images[0]} 
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      {relatedProduct.discountedPrice && (
                        <div className="absolute top-2 right-2 bg-sunrise-orange text-white text-xs font-bold px-2 py-1 rounded uppercase">
                          Sale
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow bg-pale-straw/10">
                      <div className="flex-grow">
                        <p className="text-xs text-forest-green mb-1 font-medium">{relatedProduct.seller.name}</p>
                        <h3 className="font-semibold text-sm text-deep-forest mb-1 line-clamp-2">{relatedProduct.name}</h3>
                        <div className="flex items-center mb-2">
                          <StarRating rating={relatedProduct.rating} size="sm" />
                          <span className="ml-1 text-deep-forest/60 text-xs">({relatedProduct.reviewCount})</span>
                        </div>
                        <p className="font-bold text-sm text-forest-green">{relatedProduct.discountedPrice || relatedProduct.price}</p>
                      </div>
                      <Button
                        href={`/esm-portal/products/${relatedProduct.id}`}
                        className="mt-3 text-xs bg-forest-green text-pale-straw hover:bg-moss-green transition-all py-1.5 px-2 rounded w-full text-center"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}