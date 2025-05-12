'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import SectionTitle from '@/components/common/SectionTitle';
import Button from '@/components/common/Button';

// Types
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    email?: string;
  };
  status: string;
  isHighlighted: boolean;
  publishedAt: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  category: string;
  publishedAt: string;
}

// Blog constants
const CATEGORIES = [
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

// Blog detail page component
export default function BlogDetailPage() {
  // Get slug from params
  const params = useParams();
  const slug = params.slug as string;
  
  // States
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Load blog post
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      
      try {
        // In a real implementation, this would fetch from your API
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock blog post data
        const mockPost: BlogPost = {
          id: '1',
          title: 'The Ultimate Guide to Trekking in Meghalaya',
          slug: 'ultimate-guide-trekking-meghalaya',
          summary: 'Discover the hidden gems of Meghalaya with our comprehensive trekking guide.',
          content: `
            <p>Meghalaya, known as the "abode of clouds", offers some of the most breathtaking trekking routes in Northeast India. From living root bridges to sacred forests, this guide covers everything you need to know about trekking in this beautiful state.</p>
            
            <h2>Best Trekking Routes in Meghalaya</h2>
            
            <h3>1. Double Decker Root Bridge Trek</h3>
            <p>This is perhaps the most iconic trek in Meghalaya, taking you to the famous double-decker living root bridge in Nongriat village. The trek involves climbing down and up approximately 3,500 steps, making it moderately challenging but absolutely worth the effort.</p>
            <p>Starting Point: Tyrna Village<br>
            Difficulty: Moderate<br>
            Duration: 1-2 days (overnight stay recommended in Nongriat)<br>
            Highlights: Double-decker living root bridge, natural swimming pools, beautiful waterfalls</p>
            
            <h3>2. David Scott Trail</h3>
            <p>Named after a British officer, this historic trail was once used as a horse trail in the 19th century. Today, it offers a perfect blend of history and natural beauty.</p>
            <p>Starting Point: Mawphlang<br>
            Ending Point: Ladmawphlang (or continue to Nongkrem)<br>
            Difficulty: Easy to Moderate<br>
            Duration: 4-5 hours (16 km)<br>
            Highlights: Sacred groves, meadows, streams, rural villages</p>
            
            <h3>3. Rainbow Falls Trek</h3>
            <p>This trek is an extension of the double-decker root bridge trek and takes you to the stunning Rainbow Falls, named for the rainbows that form in its mist.</p>
            <p>Starting Point: Nongriat Village<br>
            Difficulty: Moderate to Challenging<br>
            Duration: 5-6 hours round trip from Nongriat<br>
            Highlights: Rainbow Falls, jungle trails, river crossings</p>
            
            <h2>Best Time to Trek in Meghalaya</h2>
            <p>The ideal time for trekking in Meghalaya is during the dry season from October to May. The winter months (November to February) offer pleasant temperatures and clear skies, perfect for trekking. However, be aware that even during the dry season, Meghalaya can receive some rainfall as it's one of the wettest places on Earth.</p>
            <p>The monsoon season (June to September) brings heavy rainfall, making trails slippery and sometimes inaccessible. If you do plan to trek during this period, be prepared for leech encounters and challenging conditions.</p>
            
            <h2>Essential Tips for Trekking in Meghalaya</h2>
            <ul>
              <li>Always hire a local guide, especially for remote treks</li>
              <li>Carry sufficient water and snacks</li>
              <li>Wear proper trekking shoes with good grip</li>
              <li>Pack a raincoat or poncho regardless of season</li>
              <li>Respect local customs and sacred sites</li>
              <li>Carry a basic first aid kit</li>
              <li>Use eco-friendly practices and avoid single-use plastics</li>
            </ul>
            
            <h2>Accommodations and Logistics</h2>
            <p>Most trekking routes in Meghalaya are accessible from Shillong, the capital city. You can find a range of accommodations in Shillong, from budget guesthouses to luxury hotels. For treks requiring overnight stays in villages (like the Double Decker Root Bridge trek), simple homestays are available in villages like Nongriat, offering a chance to experience local culture up close.</p>
            <p>Transportation to starting points usually involves hiring a taxi or using shared vehicles. Your accommodation in Shillong can often help arrange transport and guides for your trek.</p>
            
            <h2>Conservation and Responsible Trekking</h2>
            <p>Meghalaya's ecosystems are fragile and preserving them is crucial. Follow these guidelines to minimize your impact:</p>
            <ul>
              <li>Stick to established trails</li>
              <li>Carry out all trash</li>
              <li>Avoid disturbing wildlife and picking plants</li>
              <li>Support local communities by hiring local guides and staying in homestays</li>
              <li>Be respectful when photographing local people and their homes</li>
            </ul>
            
            <p>With its living root bridges, sacred forests, crystal-clear rivers, and dramatic landscapes, Meghalaya offers a trekking experience unlike any other. By following this guide, you'll be well-prepared to explore this enchanting "abode of clouds" and create memories that will last a lifetime.</p>
          `,
          featuredImage: {
            url: '/images/hero-placeholder.jpg',
            alt: 'Double Decker Root Bridge in Meghalaya'
          },
          images: [
            {
              url: '/images/hero-placeholder.jpg',
              alt: 'Trekking trail in Meghalaya',
              caption: 'Scenic trekking trail through the forests of Meghalaya'
            },
            {
              url: '/images/hero-placeholder.jpg',
              alt: 'Rainbow Falls in Meghalaya',
              caption: 'The stunning Rainbow Falls, accessible via a trek from Nongriat village'
            },
            {
              url: '/images/hero-placeholder.jpg',
              alt: 'Living root bridge',
              caption: 'One of the many living root bridges found in the Khasi Hills'
            }
          ],
          category: 'adventure',
          tags: ['trekking', 'meghalaya', 'northeast', 'hiking', 'nature', 'travel guide'],
          author: {
            id: '1',
            name: 'John Doe'
          },
          status: 'published',
          isHighlighted: true,
          publishedAt: '2023-05-15T10:30:00.000Z',
          views: 1250,
          createdAt: '2023-05-10T08:15:00.000Z',
          updatedAt: '2023-05-12T14:30:00.000Z'
        };
        
        // Mock related posts data
        const mockRelatedPosts: RelatedPost[] = [
          {
            id: '2',
            title: 'Top 5 Camping Spots in Meghalaya',
            slug: 'top-camping-spots-meghalaya',
            featuredImage: {
              url: '/images/hero-placeholder.jpg',
              alt: 'Camping in Meghalaya'
            },
            category: 'adventure',
            publishedAt: '2023-06-20T09:15:00.000Z'
          },
          {
            id: '3',
            title: 'Water Adventures in Northeast India',
            slug: 'water-adventures-northeast-india',
            featuredImage: {
              url: '/images/hero-placeholder.jpg',
              alt: 'Rafting in Northeast India'
            },
            category: 'adventure',
            publishedAt: '2023-04-10T11:45:00.000Z'
          },
          {
            id: '4',
            title: 'A Photographer\'s Guide to Meghalaya',
            slug: 'photographers-guide-meghalaya',
            featuredImage: {
              url: '/images/hero-placeholder.jpg',
              alt: 'Landscape photography in Meghalaya'
            },
            category: 'guides',
            publishedAt: '2023-03-25T15:20:00.000Z'
          }
        ];
        
        setPost(mockPost);
        setRelatedPosts(mockRelatedPosts);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug]);
  
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
  
  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-forest-green"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-700">Error</h3>
              <p className="text-red-700">{error}</p>
              <div className="mt-4">
                <Button href="/blog" variant="primary">Return to Blog</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-deep-forest-green mb-4">Blog Post Not Found</h2>
          <p className="text-dark-grey mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button href="/blog" variant="primary">Return to Blog</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Blog Post Hero */}
      <section className="relative py-32 bg-deep-forest-green text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Category & Date */}
            <div className="flex items-center justify-between mb-6">
              <Link 
                href={`/blog?category=${post.category}`}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-full text-sm transition-colors"
              >
                {getCategoryLabel(post.category)}
              </Link>
              <div className="text-light-grey text-sm">
                {formatDate(post.publishedAt)}
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
            
            {/* Author & Reading Time */}
            <div className="flex items-center text-light-grey">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                <span>{post.author.name}</span>
              </div>
              <span className="mx-3">•</span>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{calculateReadingTime(post.content)} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Image */}
      <section className="relative -mt-12 mb-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gray-200">
                {/* Placeholder for image - would use Next.js Image in production */}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-12 gap-8">
            {/* Main Content */}
            <main className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                {/* Summary */}
                <div className="text-xl text-dark-grey mb-8 font-medium">
                  {post.summary}
                </div>
                
                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  {/* Tags */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-deep-forest-green mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link 
                          key={tag} 
                          href={`/blog?tag=${tag}`}
                          className="bg-light-grey hover:bg-gray-300 text-dark-grey px-3 py-1 rounded-full text-sm transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Share */}
                  <div>
                    <h3 className="text-lg font-bold text-deep-forest-green mb-4">Share this article</h3>
                    <div className="flex space-x-4">
                      <button aria-label="Share on Facebook" className="bg-deep-forest-green text-white p-3 rounded-full hover:bg-sunrise-orange transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button aria-label="Share on Twitter" className="bg-deep-forest-green text-white p-3 rounded-full hover:bg-sunrise-orange transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </button>
                      <button aria-label="Share on LinkedIn" className="bg-deep-forest-green text-white p-3 rounded-full hover:bg-sunrise-orange transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19.7 3H4.3C3.582 3 3 3.582 3 4.3v15.4c0 .718.582 1.3 1.3 1.3h15.4c.718 0 1.3-.582 1.3-1.3V4.3c0-.718-.582-1.3-1.3-1.3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-3.096 0 1.548 1.548 0 013.096 0zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button aria-label="Share by Email" className="bg-deep-forest-green text-white p-3 rounded-full hover:bg-sunrise-orange transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Article Gallery */}
              {post.images && post.images.length > 0 && (
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6 md:p-8">
                  <h3 className="text-xl font-bold text-deep-forest-green mb-6">Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {post.images.map((image, index) => (
                      <div key={index} className="aspect-square relative rounded overflow-hidden group">
                        <div className="absolute inset-0 bg-gray-200">
                          {/* Placeholder for image - would use Next.js Image in production */}
                        </div>
                        {image.caption && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-deep-forest-green mb-6">Related Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <article key={relatedPost.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <Link href={`/blog/${relatedPost.slug}`} className="block aspect-video relative">
                          <div className="absolute inset-0 bg-gray-200">
                            {/* Placeholder for image - would use Next.js Image in production */}
                          </div>
                        </Link>
                        <div className="p-4">
                          <div className="text-xs text-sunrise-orange mb-2">
                            {getCategoryLabel(relatedPost.category)}
                          </div>
                          <h4 className="font-bold text-deep-forest-green mb-2 line-clamp-2">
                            <Link href={`/blog/${relatedPost.slug}`} className="hover:text-sunrise-orange transition-colors">
                              {relatedPost.title}
                            </Link>
                          </h4>
                          <div className="text-sm text-gray-500">
                            {formatDate(relatedPost.publishedAt)}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </main>
            
            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-4">
              {/* Author */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-xl font-bold text-deep-forest-green mb-4">About the Author</h3>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <h4 className="font-bold text-deep-forest-green">{post.author.name}</h4>
                    <p className="text-dark-grey text-sm">Travel Writer & Guide</p>
                  </div>
                </div>
                <p className="text-dark-grey mb-4">
                  John is an experienced travel writer and guide with a passion for Northeast India's landscapes and cultures.
                </p>
                <div className="flex space-x-3">
                  <a href="#" aria-label="Twitter" className="text-dark-grey hover:text-sunrise-orange">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" aria-label="LinkedIn" className="text-dark-grey hover:text-sunrise-orange">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.7 3H4.3C3.582 3 3 3.582 3 4.3v15.4c0 .718.582 1.3 1.3 1.3h15.4c.718 0 1.3-.582 1.3-1.3V4.3c0-.718-.582-1.3-1.3-1.3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-3.096 0 1.548 1.548 0 013.096 0zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Website" className="text-dark-grey hover:text-sunrise-orange">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Table of Contents */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-xl font-bold text-deep-forest-green mb-4">Table of Contents</h3>
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-dark-grey hover:text-sunrise-orange">Best Trekking Routes in Meghalaya</a>
                      <ul className="pl-4 mt-2 space-y-2">
                        <li><a href="#" className="text-dark-grey hover:text-sunrise-orange text-sm">Double Decker Root Bridge Trek</a></li>
                        <li><a href="#" className="text-dark-grey hover:text-sunrise-orange text-sm">David Scott Trail</a></li>
                        <li><a href="#" className="text-dark-grey hover:text-sunrise-orange text-sm">Rainbow Falls Trek</a></li>
                      </ul>
                    </li>
                    <li><a href="#" className="text-dark-grey hover:text-sunrise-orange">Best Time to Trek in Meghalaya</a></li>
                    <li><a href="#" className="text-dark-grey hover:text-sunrise-orange">Essential Tips for Trekking</a></li>
                    <li><a href="#" className="text-dark-grey hover:text-sunrise-orange">Accommodations and Logistics</a></li>
                    <li><a href="#" className="text-dark-grey hover:text-sunrise-orange">Conservation and Responsible Trekking</a></li>
                  </ul>
                </nav>
              </div>
              
              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-xl font-bold text-deep-forest-green mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['trekking', 'meghalaya', 'wildlife', 'food', 'culture', 'festivals', 'northeast', 'assam', 'adventure'].map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/blog?tag=${tag}`}
                      className="bg-light-grey text-dark-grey hover:bg-gray-300 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Newsletter Signup */}
              <div className="bg-deep-forest-green rounded-lg shadow-sm p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                <p className="mb-4 text-light-grey">Get the latest articles, travel guides, and updates delivered to your inbox.</p>
                <form className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
                      required
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full">
                    Subscribe
                  </Button>
                </form>
                <p className="mt-4 text-xs text-light-grey">We respect your privacy. Unsubscribe at any time.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-light-grey">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-deep-forest-green mb-6">Ready to Explore Meghalaya?</h2>
            <p className="text-xl text-dark-grey mb-8">
              Let us help you plan your perfect adventure in the breathtaking landscapes of Northeast India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/services" variant="primary">
                View Our Services
              </Button>
              <Button href="/contact" variant="secondary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}