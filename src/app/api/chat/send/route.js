
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import Conversation from "@/models/Conversation";
import { auth } from "@/auth";

/**
 * POST handler to send a new chat message.
 * Automatically identifies or creates a conversation thread between participants.
 * Updates the conversation's last message metadata upon successful dispatch.
 */
export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { receiverId, text, conversationId } = await req.json();
        await dbConnect();

        let activeConversationId = conversationId;

        // If no conversationId provided, find or create one
        if (!activeConversationId) {
            let conversation = await Conversation.findOne({
                participants: { $all: [session.user.id, receiverId] }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [session.user.id, receiverId]
                });
            }
            activeConversationId = conversation._id;
        }

        const newMessage = await ChatMessage.create({
            conversationId: activeConversationId,
            senderId: session.user.id,
            text
        });

        // Update last message in conversation
        await Conversation.findByIdAndUpdate(activeConversationId, {
            lastMessage: text,
            lastMessageAt: new Date()
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error("Send message error:", error);
        return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
    }
}
