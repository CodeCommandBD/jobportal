
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import Conversation from "@/models/Conversation";
import { auth } from "@/auth";

/**
 * GET handler to fetch all messages for a specific conversation thread.
 * Verifies user authentication and participation before retrieving messages.
 */
export async function GET(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { threadId } = await params;
        await dbConnect();

        // Verify user is part of the conversation
        const conversation = await Conversation.findOne({
            _id: threadId,
            participants: session.user.id
        });

        if (!conversation) {
            return NextResponse.json({ message: "Forum not found or access denied" }, { status: 404 });
        }

        const messages = await ChatMessage.find({ conversationId: threadId })
            .sort({ createdAt: 1 })
            .lean();

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Fetch messages error:", error);
        return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
    }
}
