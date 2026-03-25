
'use client'

import React from 'react'
import { useBlogs } from '@/hooks/useBlogs'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

const BlogContent = () => {
    const { data: blogs, isLoading } = useBlogs();

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                     <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Latest News & Career Insights</h1>
                     <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Stay ahead with the latest trends, interview tips, and industry news curated for you.
                     </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {Array.from({ length: 6 }).map((_, i) => (
                             <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 h-[450px] animate-pulse">
                                <div className="h-56 bg-gray-200 dark:bg-gray-700 w-full"></div>
                                <div className="p-8 space-y-4">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-2/3"></div>
                                </div>
                             </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {blogs && blogs.map((blog) => (
                            <Link href={`/blog/${blog.slug}`} key={blog._id} className="group">
                                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 h-full flex flex-col hover:-translate-y-2">
                                    <div className="relative h-60 w-full overflow-hidden">
                                        <Image 
                                            src={blog.coverImage} 
                                            alt={blog.title} 
                                            fill 
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                            {blog.tags?.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-xl text-purple-600 shadow-lg">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-purple-400" />
                                                {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} className="text-purple-400" />
                                                {blog.author?.name}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
                                            {blog.title}
                                        </h3>
                                        
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                                            {blog.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 text-purple-600 font-bold text-sm group/btn px-1">
                                            Read More 
                                            <div className="bg-purple-50 dark:bg-purple-900/40 p-2 rounded-full group-hover/btn:translate-x-1 transition-all">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {blogs?.length === 0 && !isLoading && (
                    <div className="py-32 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No stories yet</h3>
                         <p className="text-gray-500">Check back soon for new career advice and updates.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BlogContent
