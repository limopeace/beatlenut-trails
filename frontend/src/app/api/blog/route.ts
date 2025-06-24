import { NextResponse } from 'next/server';
import { getAllPosts, getPostBySlug, markdownToHtml } from '@/lib/blog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    if (slug) {
      // Get a single article by slug
      const post = getPostBySlug(slug, true);
      
      if (!post) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      
      // Convert markdown to HTML
      const htmlContent = post.content ? await markdownToHtml(post.content) : '';
      
      // Format for compatibility with existing frontend
      const article = {
        id: post.slug,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: htmlContent,
        featuredImage: {
          url: post.featuredImage,
          alt: post.title,
        },
        author: {
          id: '1',
          name: post.author,
        },
        category: {
          id: post.category.toLowerCase().replace(/\s+/g, '-'),
          name: post.category,
          slug: post.category.toLowerCase().replace(/\s+/g, '-'),
        },
        publishedDate: post.publishedDate + 'T00:00:00.000Z',
        status: post.status,
      };
      
      return NextResponse.json({ docs: [article] });
    } else {
      // Get all articles with optional category filter
      const result = getAllPosts({ 
        category: category || undefined, 
        limit, 
        page,
        includeContent: false 
      });
      
      // Format posts for compatibility with existing frontend
      const articles = result.posts.map(post => ({
        id: post.slug,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: {
          url: post.featuredImage,
          alt: post.title,
        },
        author: {
          id: '1',
          name: post.author,
        },
        category: {
          id: post.category.toLowerCase().replace(/\s+/g, '-'),
          name: post.category,
          slug: post.category.toLowerCase().replace(/\s+/g, '-'),
        },
        publishedDate: post.publishedDate + 'T00:00:00.000Z',
        status: post.status,
      }));
      
      return NextResponse.json({
        docs: articles,
        totalDocs: result.totalPosts,
        page: result.currentPage,
        totalPages: result.totalPages,
      });
    }
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}