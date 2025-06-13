'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SectionTitle from '@/components/common/SectionTitle';
import Button from '@/components/common/Button';

// Types
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
  };
  publishedAt: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Blog constants
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'travel', label: 'Travel' },
  { value: 'guides', label: 'Guides' },
  { value: 'culture', label: 'Culture' },
  { value: 'food', label: 'Food' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'esm', label: 'ESM' },
  { value: 'news', label: 'News' },
  { value: 'other', label: 'Other' },
];

// Blog page component content
function BlogPageContent() {
  // States
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 6,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // URL search params
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';
  const search = searchParams.get('search') || '';
  
  // Load blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Build query string
        const query = new URLSearchParams();
        query.append('page', String(page));
        query.append('limit', String(pagination.limit));
        if (category && category !== 'all') query.append('category', category);
        if (tag) query.append('tag', tag);
        if (search) query.append('search', search);
        
        // Fetch posts
        // In a real implementation, this would fetch from your API
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock blog posts data
        const mockPosts: BlogPost[] = [
          {
            id: '1',
            title: 'The Ultimate Guide to Trekking in Meghalaya',
            slug: 'ultimate-guide-trekking-meghalaya',
            summary: 'Discover the hidden gems of Meghalaya with our comprehensive trekking guide.',
            featuredImage: {
              url: '/images/hero-placeholder.jpg',
              alt: 'Trekking trail in Meghalaya'
            },
            category: 'adventure',
            tags: ['trekking', 'meghalaya', 'northeast', 'hiking', 'nature'],
            author: {
              id: '1',
              name: 'John Doe'
            },
            publishedAt: '2023-05-15T10:30:00.000Z',
            createdAt: '2023-05-10T08:15:00.000Z'
          },
          {
            id: '2',
            title: 'Cultural Festivals of Northeast India: A Complete Calendar',
            slug: 'cultural-festivals-northeast-india-calendar',
            summary: 'Plan your visit around these vibrant and immersive cultural festivals of Northeast India.',
            featuredImage: {
              url: '/images/hero-placeholder.jpg',
              alt: 'Bihu festival celebration in Assam'
            },
            category: 'culture',
            tags: ['festivals', 'culture', 'traditions', 'northeast', 'events'],
            author: {
              id: '2',
              name: 'Jane Smith'
            },
            publishedAt: '2023-06-02T14:45:00.000Z',
            createdAt: '2023-05-28T11:30:00.000Z'
          },
          {
            id: '3',
            title: 'Wildlife Safari in Kaziranga: How to Plan Your Trip',
            slug: 'wildlife-safari-kaziranga-planning-guide',
            summary: 'Everything you need to know about planning a wildlife safari in Kaziranga National Park.',
            featuredImage: {
              url: '/images/hero-placeholder.jpg',
              alt: 'One-horned rhino in Kaziranga National Park'
            },
            category: 'wildlife',
            tags: ['kaziranga', 'safari', 'wildlife', 'rhino', 'assam'],
            author: {
              id: '1',
              name: 'John Doe'
            },
            publishedAt: '2023-04-20T09:15:00.000Z',
            createdAt: '2023-04-15T13:45:00.000Z'
          },
          {
            id: '4',
            title: 'Top 10 Street Foods to Try in Northeast India',
            slug: 'top-10-street-foods-northeast-india',
            summary: 'A culinary adventure through the vibrant street food scene of Northeast India.',
            featuredImage: {
              url: '/images/hero-placeholder.jpg',
              alt: 'Street food vendor in Shillong'
            },
            category: 'food',
            tags: ['food', 'cuisine', 'street food', 'culinary', 'traditional'],
            author: {
              id: '3',
              name: 'Priya Sharma'
            },
            publishedAt: '2023-03-12T16:20:00.000Z',
            createdAt: '2023-03-05T10:10:00.000Z'
          },
          {
            id: '5',
            title: 'ESM Success Stories: From Service to Entrepreneurship',
            slug: 'esm-success-stories-service-entrepreneurship',
            summary: 'Inspiring stories of Ex-Servicemen who have built successful businesses in Northeast India.',
            featuredImage: {
              url: '/images/hero-placeholder.jpg',
              alt: 'Ex-Serviceman entrepreneur'
            },
            category: 'esm',
            tags: ['esm', 'entrepreneurship', 'success stories', 'veterans', 'business'],
            author: {
              id: '4',
              name: 'Major Rajesh Kumar (Retd.)'
            },
            publishedAt: '2023-07-10T11:30:00.000Z',
            createdAt: '2023-07-05T09:45:00.000Z'
          },
          {
            id: '6',
            title: 'Bamboo Crafts of Northeast: Preserving Ancient Traditions',
            slug: 'bamboo-crafts-northeast-preserving-traditions',
            summary: 'Exploring the rich tradition of bamboo crafts and their significance in Northeast India.',
            featuredImage: {
              url: '/images/hero-placeholder.jpg',
              alt: 'Bamboo craft artisan at work'
            },
            category: 'culture',
            tags: ['crafts', 'bamboo', 'artisans', 'traditions', 'sustainability'],
            author: {
              id: '2',
              name: 'Jane Smith'
            },
            publishedAt: '2023-02-25T15:40:00.000Z',
            createdAt: '2023-02-20T12:15:00.000Z'
          }
        ];
        
        setPosts(mockPosts);
        setPagination({
          page,
          limit: 6,
          total: 18, // Mock total posts
          pages: 3, // Mock total pages
        });
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [page, category, tag, search, pagination.limit]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get category label
  const getCategoryLabel = (categoryValue: string) => {
    const category = CATEGORIES.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="mb-4 text-deep-forest-green opacity-30">
        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-deep-forest-green mb-2">No Blog Posts Found</h3>
      <p className="text-dark-grey mb-6">
        No blog posts match your current filters. Try adjusting your search criteria.
      </p>
      <Button href="/blog" variant="primary">View All Posts</Button>
    </div>
  );
  
  return (
    <div>
      {/* Blog Hero Section */}
      <section className="relative py-32 bg-deep-forest-green text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl text-light-grey">
              Discover insider tips, travel guides, and stories from Northeast India
            </p>
            
            {/* Search Box */}
            <div className="mt-8 relative max-w-xl mx-auto">
              <form action="/blog" method="get">
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search blog posts..."
                  className="w-full py-3 px-4 pr-12 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                  aria-label="Search"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Content Section */}
      <section className="py-16 bg-off-white">
        <div className="container-custom">
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="font-bold text-xl text-deep-forest-green mb-4">Categories</h2>
                <ul className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.value}>
                      <Link 
                        href={cat.value === 'all' ? '/blog' : `/blog?category=${cat.value}`}
                        className={`block py-2 px-3 rounded hover:bg-light-grey transition-colors ${
                          (category === cat.value || (!category && cat.value === 'all')) 
                            ? 'bg-deep-forest-green text-white' 
                            : 'text-dark-grey'
                        }`}
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="font-bold text-xl text-deep-forest-green mb-4">Popular Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {['trekking', 'meghalaya', 'wildlife', 'food', 'culture', 'festivals', 'northeast', 'assam', 'adventure'].map((t) => (
                    <Link 
                      key={t} 
                      href={`/blog?tag=${t}`}
                      className={`inline-block py-1 px-3 rounded-full text-sm ${
                        tag === t 
                          ? 'bg-sunrise-orange text-white' 
                          : 'bg-light-grey text-dark-grey hover:bg-gray-300'
                      } transition-colors`}
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Featured Post */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-bold text-xl text-deep-forest-green mb-4">Featured Post</h2>
                <div className="space-y-4">
                  <div className="aspect-video relative rounded overflow-hidden">
                    <div className="bg-gray-200 absolute inset-0">
                      {/* Placeholder for image */}
                    </div>
                  </div>
                  <h3 className="font-semibold text-deep-forest-green">
                    <Link href="/blog/esm-success-stories-service-entrepreneurship" className="hover:text-sunrise-orange transition-colors">
                      ESM Success Stories: From Service to Entrepreneurship
                    </Link>
                  </h3>
                  <div className="text-sm text-dark-grey">
                    July 10, 2023
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Main Content */}
            <main className="col-span-12 lg:col-span-9">
              {/* Current Filters */}
              {(category || tag || search) && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex items-center justify-between">
                  <div className="text-dark-grey">
                    <span className="font-medium">Filtering by:</span>{' '}
                    {category && <span className="ml-2">Category: <span className="text-deep-forest-green font-medium">{getCategoryLabel(category)}</span></span>}
                    {tag && <span className="ml-2">Tag: <span className="text-deep-forest-green font-medium">{tag}</span></span>}
                    {search && <span className="ml-2">Search: <span className="text-deep-forest-green font-medium">"{search}"</span></span>}
                  </div>
                  <Link href="/blog" className="text-sunrise-orange hover:underline text-sm flex items-center">
                    <span>Clear filters</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </Link>
                </div>
              )}
              
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-forest-green"></div>
                </div>
              )}
              
              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Blog Posts Grid */}
              {!loading && !error && (
                <>
                  {posts.length === 0 ? (
                    renderEmptyState()
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {posts.map((post) => (
                        <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                          {/* Post Image */}
                          <Link href={`/blog/${post.slug}`} className="block aspect-video relative">
                            <div className="absolute inset-0 bg-gray-200">
                              {/* Placeholder for image - would use Next.js Image in production */}
                            </div>
                          </Link>
                          
                          {/* Post Content */}
                          <div className="p-6">
                            {/* Category & Date */}
                            <div className="flex items-center justify-between text-sm mb-2">
                              <Link 
                                href={`/blog?category=${post.category}`}
                                className="text-sunrise-orange hover:underline"
                              >
                                {getCategoryLabel(post.category)}
                              </Link>
                              <span className="text-gray-500">{formatDate(post.publishedAt)}</span>
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-xl font-bold text-deep-forest-green mb-3 line-clamp-2">
                              <Link href={`/blog/${post.slug}`} className="hover:text-sunrise-orange transition-colors">
                                {post.title}
                              </Link>
                            </h2>
                            
                            {/* Summary */}
                            <p className="text-dark-grey mb-4 line-clamp-3">
                              {post.summary}
                            </p>
                            
                            {/* Read More */}
                            <Link 
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center text-vibrant-teal hover:text-deep-forest-green font-medium transition-colors"
                            >
                              <span>Read more</span>
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                              </svg>
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {/* Pagination */}
              {!loading && !error && pagination.pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    {/* Previous Page */}
                    <Link
                      href={`/blog?page=${Math.max(1, pagination.page - 1)}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}
                      className={`relative inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        pagination.page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-disabled={pagination.page === 1}
                      tabIndex={pagination.page === 1 ? -1 : 0}
                    >
                      Previous
                    </Link>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/blog?page=${pageNum}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}
                        className={`relative inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                          pageNum === pagination.page
                            ? 'bg-deep-forest-green text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-current={pageNum === pagination.page ? 'page' : undefined}
                      >
                        {pageNum}
                      </Link>
                    ))}
                    
                    {/* Next Page */}
                    <Link
                      href={`/blog?page=${Math.min(pagination.pages, pagination.page + 1)}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}
                      className={`relative inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        pagination.page === pagination.pages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-disabled={pagination.page === pagination.pages}
                      tabIndex={pagination.page === pagination.pages ? -1 : 0}
                    >
                      Next
                    </Link>
                  </nav>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

// Main component with Suspense wrapper
export default function BlogPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <BlogPageContent />
    </Suspense>
  );
}