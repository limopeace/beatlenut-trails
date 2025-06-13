'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Types
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage?: {
    url: string;
    alt: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isHighlighted: boolean;
  author: {
    id: string;
    name: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface NewBlogPost {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isHighlighted: boolean;
}

// Blog categories
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

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<NewBlogPost>({
    title: '',
    summary: '',
    content: '',
    category: 'travel',
    tags: [],
    status: 'draft',
    isHighlighted: false,
  });
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();

  // Load blog posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // For now, using mock data. In production, this would call the API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'The Ultimate Guide to Trekking in Meghalaya',
          slug: 'ultimate-guide-trekking-meghalaya',
          summary: 'Discover the hidden gems of Meghalaya with our comprehensive trekking guide.',
          content: 'Full content of the blog post goes here...',
          category: 'adventure',
          tags: ['trekking', 'meghalaya', 'northeast', 'hiking', 'nature'],
          status: 'published',
          isHighlighted: true,
          author: { id: '1', name: 'Admin User' },
          publishedAt: '2023-05-15T10:30:00.000Z',
          createdAt: '2023-05-10T08:15:00.000Z',
          updatedAt: '2023-05-15T10:30:00.000Z'
        },
        {
          id: '2',
          title: 'Cultural Festivals of Northeast India',
          slug: 'cultural-festivals-northeast-india-calendar',
          summary: 'Plan your visit around these vibrant and immersive cultural festivals.',
          content: 'Full content of the blog post goes here...',
          category: 'culture',
          tags: ['festivals', 'culture', 'traditions', 'northeast', 'events'],
          status: 'draft',
          isHighlighted: false,
          author: { id: '1', name: 'Admin User' },
          createdAt: '2023-05-28T11:30:00.000Z',
          updatedAt: '2023-05-28T11:30:00.000Z'
        }
      ];
      
      setPosts(mockPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPost) {
        // Update existing post
        console.log('Updating post:', editingPost.id, formData);
        // In production: await updateBlogPost(editingPost.id, formData);
      } else {
        // Create new post
        console.log('Creating new post:', formData);
        // In production: await createBlogPost(formData);
      }
      
      // Reset form and refresh posts
      setFormData({
        title: '',
        summary: '',
        content: '',
        category: 'travel',
        tags: [],
        status: 'draft',
        isHighlighted: false,
      });
      setTagInput('');
      setShowCreateForm(false);
      setEditingPost(null);
      await fetchPosts();
      
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save blog post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      summary: post.summary,
      content: post.content,
      category: post.category,
      tags: post.tags,
      status: post.status,
      isHighlighted: post.isHighlighted,
    });
    setTagInput(post.tags.join(', '));
    setShowCreateForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      console.log('Deleting post:', postId);
      // In production: await deleteBlogPost(postId);
      await fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete blog post');
    }
  };

  const handleStatusChange = async (postId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      console.log('Changing status:', postId, newStatus);
      // In production: await updateBlogPostStatus(postId, newStatus);
      await fetchPosts();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update post status');
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const newTags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({
        ...prev,
        tags: Array.from(new Set([...prev.tags, ...newTags]))
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingPost(null);
            setFormData({
              title: '',
              summary: '',
              content: '',
              category: 'travel',
              tags: [],
              status: 'draft',
              isHighlighted: false,
            });
            setTagInput('');
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Create New Post
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={10}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Enter tags separated by commas"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isHighlighted}
                  onChange={(e) => setFormData(prev => ({ ...prev, isHighlighted: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Highlight this post</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingPost(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Blog Posts ({posts.length})</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found. Create your first post!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {post.title}
                          {post.isHighlighted && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{post.summary}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={post.status}
                        onChange={(e) => handleStatusChange(post.id, e.target.value as 'draft' | 'published' | 'archived')}
                        className={`text-xs px-2 py-1 rounded ${getStatusBadgeClass(post.status)}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(post.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-green-600 hover:text-green-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}