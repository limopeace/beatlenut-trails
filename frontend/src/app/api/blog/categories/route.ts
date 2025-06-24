import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/blog';

export async function GET() {
  try {
    const categories = getAllCategories();
    
    // Format for compatibility with existing frontend
    const formattedCategories = categories.map(category => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
    }));
    
    return NextResponse.json({
      docs: formattedCategories,
      totalDocs: formattedCategories.length,
      page: 1,
      totalPages: 1,
    });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}