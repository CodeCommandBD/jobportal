
'use client'

import React, { useState } from 'react';
import { useBlogs, useCreateBlog, useDeleteBlog } from '@/hooks/useBlogs';
import SectionHeading from '@/Components/helpers/SectionHeading';
import { TableRowSkeleton } from '@/Components/helpers/SkeletonLoader';
import { Plus, Trash2, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const AdminBlogPage = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        coverImage: '',
        tags: ''
    });

    const { data: blogs, isLoading } = useBlogs();
    const createBlogMutation = useCreateBlog();
    const deleteBlogMutation = useDeleteBlog();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        
        try {
            await createBlogMutation.mutateAsync({
                ...formData,
                tags: tagsArray
            });
            toast.success('Blog post created successfully!');
            setIsAdding(false);
            setFormData({ title: '', excerpt: '', content: '', coverImage: '', tags: '' });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to create blog post');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await deleteBlogMutation.mutateAsync(id);
                toast.success('Blog post deleted');
            } catch (error) {
                toast.error('Failed to delete blog post');
            }
        }
    };

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <SectionHeading 
                    heading="Blog Management" 
                    subheading="Create and manage your career advice and industry news posts." 
                />
                <Button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 h-12 shadow-lg shadow-purple-500/20"
                >
                    {isAdding ? 'Cancel' : <><Plus className="mr-2 h-5 w-5" /> New Post</>}
                </Button>
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-purple-100 dark:border-purple-900/20 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="text-purple-600" /> Create New Blog Post
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                            <Input 
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter a catchy title..." 
                                required
                                className="h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Cover Image URL</label>
                            <Input 
                                name="coverImage"
                                value={formData.coverImage}
                                onChange={handleInputChange}
                                placeholder="https://unsplash.com/..." 
                                required
                                className="h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Tags (comma separated)</label>
                            <Input 
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="Career, Tech, Interview..." 
                                className="h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Excerpt (Short Summary)</label>
                            <textarea 
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                                placeholder="Briefly describe what this post is about..."
                                required
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Full Content</label>
                            <textarea 
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                rows={8}
                                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                                placeholder="Write your full blog content here..."
                                required
                            />
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <Button 
                                type="submit" 
                                disabled={createBlogMutation.isLoading}
                                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/30 font-bold"
                            >
                                {createBlogMutation.isLoading ? 'Publishing...' : 'Publish Blog Post'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Post Details</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRowSkeleton key={i} />
                                ))
                            ) : (
                                blogs?.length > 0 ? (
                                    blogs.map((blog) => (
                                        <tr key={blog._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                        <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors line-clamp-1">{blog.title}</div>
                                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                                            <Tag size={12} /> {blog.tags?.join(', ') || 'No tags'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600">
                                                        <User size={14} />
                                                    </div>
                                                    {blog.author?.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                                    <Calendar size={14} /> {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <a 
                                                        href={`/blog/${blog.slug}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
                                                    <button 
                                                        onClick={() => handleDelete(blog._id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <div className="text-gray-400 mb-2 font-medium">No blog posts found.</div>
                                            <Button variant="link" onClick={() => setIsAdding(true)} className="text-purple-600">Start by creating your first post</Button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBlogPage;
