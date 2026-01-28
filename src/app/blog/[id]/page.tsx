
'use client'

import React from 'react'
import { useParams } from 'next/navigation' // Use useParams instead of props for client component if easier, or stay server
// Actually, for dynamic segment in App Router, page receives params prop.
// Since we used client for listing to keep it simple with react-query, we can do same here or server.
// Let's stick to Server Component for SEO on single page, but wait, API is local.
// We can use Client component with useQuery for consistency with listing.

import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/Components/ui/button'

interface BlogPost {
    _id: string
    title: string
    content: string
    coverImage: string
    author: {
        name: string
        image?: string
    }
    tags: string[]
    createdAt: string
}

const SingleBlogPage = () => {
    // Handling params in newer Next.js client components:
    // We can use useParams() hook from next/navigation
    const params = useParams()
    const id = params?.id as string

    const { data: blog, isLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: async () => {
            // We need an endpoint for single blog. Assuming GET /blogs returns array,
            // we might need GET /blogs?id=... or filter on client if array is small.
            // Best is GET /blogs/[id] but I only made /blogs. 
            // Let's quickly update API or just filter from list for now since it's dummy data.
            const { data } = await axiosInstance.get('/blogs')
            const post = data.find((p: BlogPost) => p._id === id)
            if (!post) throw new Error("Blog not found")
            return post as BlogPost
        },
        enabled: !!id
    })

    if (isLoading) return <div className="min-h-screen pt-24 text-center">Loading...</div>
    if (!blog) return <div className="min-h-screen pt-24 text-center">Blog post not found.</div>

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>

                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                    {blog.title}
                </h1>

                <div className="flex items-center gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                             {blog.author.name.charAt(0)}
                         </div>
                         <div>
                             <p className="text-sm font-bold text-gray-900 dark:text-white">{blog.author.name}</p>
                             <p className="text-xs text-gray-500">Author</p>
                         </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500">
                             <Calendar size={18} />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-gray-900 dark:text-white">{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</p>
                             <p className="text-xs text-gray-500">Published</p>
                         </div>
                    </div>
                </div>

                <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
                    <Image 
                        src={blog.coverImage} 
                        alt={blog.title} 
                        fill 
                        className="object-cover"
                    />
                </div>

                <div className="prose dark:prose-invert prose-lg max-w-none text-gray-700 dark:text-gray-300">
                    {/* Render content - assuming plain text or html for now. 
                        For dummy data strings, just display. */}
                    <p>{blog.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}</p>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
             </div>
        </div>
    )
}

export default SingleBlogPage
