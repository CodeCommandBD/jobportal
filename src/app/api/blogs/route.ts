
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // For now, return dummy data if no blogs exist, or fetch from DB
    // I'll seed some dummy data in memory if DB is empty to make it dynamic immediately
    const blogs = await Blog.find().sort({ createdAt: -1 });

    if (blogs.length === 0) {
        // Return dummy data for demo purposes since we don't have a blog CMS yet
        return NextResponse.json([
            {
                _id: '1',
                title: 'Top 10 Interview Questions for Frontend Developers',
                slug: 'top-10-interview-questions',
                excerpt: 'Prepare for your next interview with this comprehensive list of questions covering React, CSS, and System Design.',
                coverImage: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=3540&auto=format&fit=crop',
                author: { name: 'Sarah Wilson', image: '' },
                tags: ['Interview', 'Frontend', 'Career'],
                createdAt: new Date().toISOString()
            },
            {
                _id: '2',
                title: 'Navigation Layouts: Best Practices 2026',
                slug: 'navigation-layouts-2026',
                excerpt: 'Explore the latest trends in navigation design, from glassmorphism to dynamic island style menus.',
                coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=3355&auto=format&fit=crop',
                author: { name: 'James Carter', image: '' },
                tags: ['Design', 'UX', 'Web'],
                createdAt: new Date().toISOString()
            },
            {
                _id: '3',
                title: 'Why Remote Work is Here to Stay',
                slug: 'remote-work-stay',
                excerpt: 'Analysis of remote work trends and how they impact productivity and employee happiness.',
                coverImage: 'https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=3538&auto=format&fit=crop',
                author: { name: 'Emily Chen', image: '' },
                tags: ['Remote Work', 'Culture'],
                createdAt: new Date().toISOString()
            }
        ], { status: 200 });
    }

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
