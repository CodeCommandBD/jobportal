
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";
import { auth } from "@/auth";
import { logActivity } from "@/lib/audit";

export async function GET() {
    try {
        await dbConnect();
        const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
        return NextResponse.json(announcements);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch announcements" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();
        const newAnnouncement = await Announcement.create(body);

        await logActivity({
            adminId: session.user?.id || '',
            adminName: session.user?.name || 'Admin',
            action: "Created Announcement",
            details: `Announcement: "${body.text.substring(0, 50)}..."`,
        });

        return NextResponse.json(newAnnouncement, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create announcement" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

        await dbConnect();
        const deleted = await Announcement.findByIdAndDelete(id);

        if (deleted) {
            await logActivity({
                adminId: session.user?.id || '',
                adminName: session.user?.name || 'Admin',
                action: "Deleted Announcement",
                details: `Deleted announcement ID: ${id}`,
            });
        }

        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
    }
}
