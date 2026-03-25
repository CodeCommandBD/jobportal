
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { auth } from '@/auth';

export async function GET(req) {
    try {
        await dbConnect();
        const blogs = await Blog.find().sort({ createdAt: -1 });

        // If no blogs in DB, return a mix of DB and dummy or just empty
        // For production feel, we'll return what's in DB.
        return NextResponse.json(blogs, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        // Only admin or authorized users should post blogs
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        
        const { title, content, excerpt, coverImage, tags } = body;

        if (!title || !content || !excerpt || !coverImage) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Generate simple slug from title
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const newBlog = await Blog.create({
            title,
            slug,
            excerpt,
            content,
            coverImage,
            tags: tags || [],
            author: {
                name: session.user.name || 'Admin',
                image: session.user.image || ''
            }
        });

        return NextResponse.json(newBlog, { status: 201 });
    } catch (error) {
        console.error('Error creating blog:', error);
        if (error.code === 11000) {
            return NextResponse.json({ message: 'A blog with this title already exists' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
