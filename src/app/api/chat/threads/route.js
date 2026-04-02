
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";
import { auth } from "@/auth";

/**
 * GET handler to retrieve all active chat threads for the authenticated user.
 * Each thread is formatted to highlight the conversation partner.
 */
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();

        const conversations = await Conversation.find({
            participants: session.user.id
        })
        .sort({ lastMessageAt: -1 })
        .populate('participants', 'name email image role')
        .lean();

        // Filter out the current user from participants list for each conversation
        const formattedThreads = conversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id.toString() !== session.user.id);
            return {
                ...conv,
                otherUser
            };
        });

        return NextResponse.json(formattedThreads);
    } catch (error) {
        console.error("Fetch threads error:", error);
        return NextResponse.json({ message: "Failed to fetch threads" }, { status: 500 });
    }
}
