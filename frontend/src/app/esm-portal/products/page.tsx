'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { EsmProductService, EsmProduct } from '@/services/api/esmProductService';

// Function to get product images from our real images collection
const getProductImage = (id: number) => {
  const realImages = [
    '/images/real/pexels-kanishka-211910-679492-min.jpg',
    '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
    '/images/real/pexels-nans1419-20519339-min.jpg',
    '/images/real/pexels-dizitalboost-11622977-min.jpg',
    '/images/real/pexels-travelerchitect-18736328-min.jpg',
    '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
    '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
  ];
  
  // Use modulo to cycle through the available images
  return realImages[(id - 1) % realImages.length];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<EsmProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sample product data (fallback for when API is not available)
  const sampleProducts = [
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

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategories, selectedPriceRanges, sortBy, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = {
        search: searchQuery,
        category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
        sortBy: sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? 'price' : sortBy === 'newest' ? 'date' : 'name',
        sortOrder: sortBy === 'price-high' ? 'desc' : 'asc',
        page: currentPage,
        limit: 9
      };
      
      const response = await EsmProductService.getProducts(filters);
      setProducts(response.products);
      setTotalPages(response.pagination.pages);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      // Use sample data as fallback
      setProducts(sampleProducts.map((p, index) => ({ ...p, _id: String(index + 1) })));
    } finally {
      setLoading(false);
    }
  };

  // Available categories from the products
  const categories = loading ? [] : Array.from(new Set(products.map(product => product.category || 'Other')));

  // Price ranges for filtering
  const priceRanges = [
  { label: 'Under ₹1,000', value: 'under1000' },
  { label: '₹1,000 - ₹2,000', value: '1000to2000' },
  { label: '₹2,000 - ₹5,000', value: '2000to5000' },
  { label: 'Above ₹5,000', value: 'above5000' },
];
  
  // Client-side filtering (in case API filtering isn't working)
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.seller?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(product.category || 'Other');
    
    // Price filter
    const price = product.price;
    let matchesPrice = selectedPriceRanges.length === 0;
    
    if (selectedPriceRanges.includes('under1000') && price < 1000) matchesPrice = true;
    if (selectedPriceRanges.includes('1000to2000') && price >= 1000 && price <= 2000) matchesPrice = true;
    if (selectedPriceRanges.includes('2000to5000') && price >= 2000 && price <= 5000) matchesPrice = true;
    if (selectedPriceRanges.includes('above5000') && price > 5000) matchesPrice = true;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handlePriceToggle = (range: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  return (
    <>
      {/* Page Header */}
      <section className="bg-deep-forest pt-32 pb-12 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-pale-straw">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-clash">
              ESM Marketplace Products
            </h1>
            <p className="text-xl mb-8">
              Browse high-quality products made by skilled Ex-Servicemen from across India
            </p>
            
            {/* Search Bar */}
            <div className="esm-search-container max-w-2xl mx-auto">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, sellers, or categories..."
                className="esm-search-input w-full px-6 py-4 text-lg text-gray-900 bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-forest-green/20"
              />
              <button className="esm-search-button absolute right-3 top-1/2 transform -translate-y-1/2 bg-forest-green text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-moss-green transition-colors">
                <FontAwesomeIcon icon={faSearch} className="text-lg" />
              </button>
            </div>
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
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        />
                        <label htmlFor={`category-${index}`} className="ml-2 text-gray-700 cursor-pointer">
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
                          checked={selectedPriceRanges.includes(range.value)}
                          onChange={() => handlePriceToggle(range.value)}
                        />
                        <label htmlFor={`price-${range.value}`} className="ml-2 text-gray-700 cursor-pointer">
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
                  className="w-full bg-deep-forest text-pale-straw hover:bg-forest-green"
                  variant="primary"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Results Count and Sort */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <p className="text-gray-700 mb-4 md:mb-0">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
                
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
                {filteredProducts.map((product) => (
                  <div key={product.id} className="card group">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={getProductImage(product.id)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-moss-green/20 text-deep-forest rounded-full mb-2">
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
      <section className="py-16 bg-forest-green text-pale-straw">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-clash">
            Are You an Ex-Serviceman?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join our marketplace today and showcase your products to customers across India. Registration is simple and free!
          </p>
          <Button
            href="/esm-portal/register"
            variant="secondary"
            className="border-2 border-pale-straw text-pale-straw hover:bg-pale-straw hover:text-deep-forest shadow-md"
          >
            Register as a Seller
          </Button>
        </div>
      </section>
    </>
  );
}