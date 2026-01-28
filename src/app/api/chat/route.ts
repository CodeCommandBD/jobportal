
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import { auth } from '@/auth';

export async function GET() {
    await dbConnect();
    try {
        const messages = await Message.find().sort({ createdAt: 1 });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const session = await auth();
        const body = await req.json();
        const { text, senderName, senderId } = body;

        const newMessage = await Message.create({
            text,
            senderName: session?.user?.name || senderName || 'Guest',
            senderId: session?.user?.id || senderId || 'guest-' + Date.now(),
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
