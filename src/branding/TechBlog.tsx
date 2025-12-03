import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ChevronRight, BookOpen, Search, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const posts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Frontend Development',
    excerpt: 'Exploring the latest trends in React, Server Components, and the shift towards edge computing.',
    date: 'Oct 15, 2023',
    readTime: '5 min read',
    category: 'Tech',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    content: `
# The Future of Frontend Development

Frontend development is evolving at a rapid pace. With the introduction of Server Components in React, we are seeing a paradigm shift in how we build web applications.

## Server Components

React Server Components allow developers to write components that render exclusively on the server. This reduces the bundle size sent to the client and improves initial load performance.

## Edge Computing

The move to the edge means that our applications are running closer to the user than ever before. This results in lower latency and a better user experience.

## Conclusion

The future is bright for frontend developers. Embracing these new technologies will be key to staying ahead of the curve.
    `
  },
  {
    id: '2',
    title: 'Mastering Tailwind CSS',
    excerpt: 'A comprehensive guide to building beautiful, responsive interfaces with utility-first CSS.',
    date: 'Sep 28, 2023',
    readTime: '8 min read',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80',
    content: `
# Mastering Tailwind CSS

Tailwind CSS has revolutionized the way we style web applications. By using utility classes, we can build complex designs without ever leaving our HTML.

## Why Tailwind?

1. **Speed**: Rapid prototyping is a breeze.
2. **Consistency**: Design tokens ensure a cohesive look.
3. **Size**: Unused styles are purged in production.

## Best Practices

- Use components to extract repeating patterns.
- Leverage the configuration file for customization.
- Don't be afraid of long class strings; they are descriptive!
    `
  },
  {
    id: '3',
    title: 'Building Scalable Systems',
    excerpt: 'Lessons learned from architecting high-traffic applications and microservices.',
    date: 'Aug 10, 2023',
    readTime: '12 min read',
    category: 'Architecture',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    content: `
# Building Scalable Systems

Scalability is not just about handling more traffic; it's about maintainability and reliability.

## Microservices vs. Monolith

There is no one-size-fits-all answer. Monoliths are great for starting out, but microservices offer better scalability for large teams.

## Database Design

Choosing the right database (SQL vs. NoSQL) is crucial. Understand your data access patterns before making a decision.
    `
  }
];

const CATEGORIES = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (selectedPost) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-slate-600 hover:text-indigo-600 mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </button>

          <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title} 
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                  {selectedPost.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {selectedPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {selectedPost.readTime}
                </span>
              </div>

              <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-indigo-600 prose-img:rounded-xl">
                <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
                <BookOpen size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Tech Blog</h1>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <div 
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 rounded-full text-xs font-bold shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:translate-x-2 transition-transform pt-4 border-t border-slate-100 mt-auto">
                    Read Article <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No articles found</h3>
            <p className="text-slate-500">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};
