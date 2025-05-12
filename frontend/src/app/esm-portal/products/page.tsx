import React from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';

// Sample product data (to be replaced with API calls in the future)
const products = [
  {
    id: 1,
    name: 'Handcrafted Bamboo Art',
    price: '₹1,200',
    description: 'Beautifully handcrafted bamboo art pieces made by skilled artisans with traditional techniques.',
    seller: 'Capt. Rajesh Singh (Retd.)',
    image: '/images/hero-placeholder.jpg',
    category: 'Handicrafts',
  },
  {
    id: 2,
    name: 'Organic Tea Collection',
    price: '₹850',
    description: 'Premium assortment of organic teas grown in the foothills of the Himalayas without pesticides.',
    seller: 'Maj. Anand Kumar (Retd.)',
    image: '/images/hero-placeholder.jpg',
    category: 'Food Products',
  },
  {
    id: 3,
    name: 'Traditional Handloom Textiles',
    price: '₹2,500',
    description: 'Exquisite handloom textiles created using time-honored weaving techniques and natural dyes.',
    seller: 'Lt. Col. Vijay Sharma (Retd.)',
    image: '/images/hero-placeholder.jpg',
    category: 'Handicrafts',
  },
  {
    id: 4,
    name: 'Security Consultation Services',
    price: 'Contact for pricing',
    description: 'Professional security assessment and consultation services for businesses and residential properties.',
    seller: 'Col. Amar Joshi (Retd.)',
    image: '/images/hero-placeholder.jpg',
    category: 'Security Services',
  },
  {
    id: 5,
    name: 'Himalayan Honey',
    price: '₹750',
    description: 'Pure, raw honey sourced from the pristine Himalayan region, collected using sustainable methods.',
    seller: 'Wing Cdr. Suman Rao (Retd.)',
    image: '/images/hero-placeholder.jpg',
    category: 'Food Products',
  },
  {
    id: 6,
    name: 'Military Leadership Training',
    price: '₹15,000 per session',
    description: 'Corporate leadership training programs based on military principles and extensive field experience.',
    seller: 'Brig. Harish Mehta (Retd.)',
    image: '/images/hero-placeholder.jpg',
    category: 'Training',
  },
  {
    id: 7,
    name: 'Brass Home Decor Items',
    price: '₹1,800',
    description: 'Elegant brass home decor items handcrafted with precision and attention to detail.',
    seller: 'Lt. Shikha Gupta (Retd.)',
    image: '/images/hero-placeholder.jpg',
    category: 'Handicrafts',
  },
  {
    id: 8,
    name: 'Organic Farm Fresh Vegetables',
    price: '₹500 per box',
    description: 'Weekly subscription of fresh, organically grown seasonal vegetables from veteran-owned farms.',
    seller: 'Maj. Deepak Nair (Retd.)',
    image: '/images/hero-placeholder.jpg',
    category: 'Agriculture',
  },
];

// Available categories from the products
const categories = Array.from(new Set(products.map(product => product.category)));

// Price ranges for filtering
const priceRanges = [
  { label: 'Under ₹1,000', value: 'under1000' },
  { label: '₹1,000 - ₹2,000', value: '1000to2000' },
  { label: '₹2,000 - ₹5,000', value: '2000to5000' },
  { label: 'Above ₹5,000', value: 'above5000' },
];

export default function ProductsPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-deep-forest-green pt-32 pb-12 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-off-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ESM Marketplace Products
            </h1>
            <p className="text-xl mb-0">
              Browse high-quality products made by skilled Ex-Servicemen from across India
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="font-medium text-lg mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`category-${index}`} 
                          className="w-4 h-4 text-deep-forest-green" 
                        />
                        <label htmlFor={`category-${index}`} className="ml-2 text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-8">
                  <h4 className="font-medium text-lg mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <div key={index} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`price-${range.value}`} 
                          className="w-4 h-4 text-deep-forest-green" 
                        />
                        <label htmlFor={`price-${range.value}`} className="ml-2 text-gray-700">
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Seller Type Filter */}
                <div className="mb-8">
                  <h4 className="font-medium text-lg mb-3">Seller Type</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="seller-army" 
                        className="w-4 h-4 text-deep-forest-green" 
                      />
                      <label htmlFor="seller-army" className="ml-2 text-gray-700">
                        Army Veterans
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="seller-navy" 
                        className="w-4 h-4 text-deep-forest-green" 
                      />
                      <label htmlFor="seller-navy" className="ml-2 text-gray-700">
                        Navy Veterans
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="seller-airforce" 
                        className="w-4 h-4 text-deep-forest-green" 
                      />
                      <label htmlFor="seller-airforce" className="ml-2 text-gray-700">
                        Air Force Veterans
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-deep-forest-green hover:bg-vibrant-teal"
                  variant="primary"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Search and Sort */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div className="relative w-full md:w-96 mb-4 md:mb-0">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                  />
                  <button className="absolute right-3 top-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center">
                  <span className="mr-2 text-gray-700">Sort by:</span>
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deep-forest-green">
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
              
              {/* Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="card group">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-light-grey text-deep-forest-green rounded-full mb-2">
                        {product.category}
                      </span>
                      <p className="text-sm text-gray-500 mb-1">{product.seller}</p>
                      <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <p className="font-bold text-sunrise-orange">{product.price}</p>
                      <div className="flex mt-3 space-x-2">
                        <Button
                          href={`/esm-portal/products/${product.id}`}
                          variant="tertiary"
                          className="px-0 py-0"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-sm px-3 py-1"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-light-grey">
                    Previous
                  </button>
                  <button className="px-3 py-2 rounded-md bg-deep-forest-green text-white">
                    1
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-light-grey">
                    2
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-light-grey">
                    3
                  </button>
                  <span className="px-2">...</span>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-light-grey">
                    8
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-light-grey">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-vibrant-teal text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Are You an Ex-Serviceman?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join our marketplace today and showcase your products to customers across India. Registration is simple and free!
          </p>
          <Button
            href="/esm-portal/register"
            variant="secondary"
            className="border-2 border-white text-white hover:bg-white hover:text-vibrant-teal"
          >
            Register as a Seller
          </Button>
        </div>
      </section>
    </>
  );
}