
'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/Components/ui/button'

interface BlogPost {
    _id: string
    title: string
    slug: string
    excerpt: string
    coverImage: string
    author: {
        name: string
        image?: string
    }
    tags: string[]
    createdAt: string
}

const BlogContent = () => {
    const { data: blogs, isLoading } = useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/blogs')
            return data as BlogPost[]
        }
    })

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Latest News & Insights</h1>
                     <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Stay updated with the latest trends, career advice, and industry news.
                     </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                             <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 h-96 animate-pulse">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full mb-4"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                </div>
                             </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs && blogs.map((blog) => (
                            <Link href={`/blog/${blog._id}`} key={blog._id} className="group">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image 
                                            src={blog.coverImage} 
                                            alt={blog.title} 
                                            fill 
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            {blog.tags.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-bold rounded-lg text-purple-600">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User size={12} />
                                                {blog.author.name}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                                            {blog.excerpt}
                                        </p>

                                        <div className="text-purple-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read Article <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BlogContent
