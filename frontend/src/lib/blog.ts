import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  featuredImage: string;
  category: string;
  author: string;
  publishedDate: string;
  status: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
}

// Get all blog post slugs
export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(name => name.endsWith('.md'))
      .map(name => name.replace(/\.md$/, ''));
  } catch (error) {
    console.warn('Blog directory not found, returning empty array');
    return [];
  }
}

// Get all categories from posts
export function getAllCategories(): BlogCategory[] {
  const slugs = getAllPostSlugs();
  const categories = new Set<string>();
  
  slugs.forEach(slug => {
    const post = getPostBySlug(slug, false);
    if (post && post.status === 'published') {
      categories.add(post.category);
    }
  });
  
  return Array.from(categories).map(category => ({
    name: category,
    slug: category.toLowerCase().replace(/\s+/g, '-')
  }));
}

// Get post data by slug
export function getPostBySlug(slug: string, includeContent: boolean = true): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const post: BlogPost = {
      slug: realSlug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      featuredImage: data.featuredImage || '',
      category: data.category || 'Uncategorized',
      author: data.author || 'Anonymous',
      publishedDate: data.publishedDate || new Date().toISOString().split('T')[0],
      status: data.status || 'draft',
    };
    
    if (includeContent) {
      post.content = content;
    }
    
    return post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

// Get all posts with optional filtering
export function getAllPosts(options: {
  category?: string;
  limit?: number;
  page?: number;
  includeContent?: boolean;
} = {}): {
  posts: BlogPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
} {
  const {
    category,
    limit = 10,
    page = 1,
    includeContent = false
  } = options;
  
  const slugs = getAllPostSlugs();
  let posts = slugs
    .map(slug => getPostBySlug(slug, includeContent))
    .filter((post): post is BlogPost => post !== null)
    .filter(post => post.status === 'published')
    .filter(post => !category || post.category.toLowerCase().replace(/\s+/g, '-') === category);
  
  // Sort by publishedDate (newest first)
  posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);
  
  return {
    posts: paginatedPosts,
    totalPosts,
    totalPages,
    currentPage: page
  };
}

// Convert markdown to HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

// Get recent posts for homepage
export function getRecentPosts(limit: number = 3): BlogPost[] {
  const { posts } = getAllPosts({ limit, includeContent: false });
  return posts;
}