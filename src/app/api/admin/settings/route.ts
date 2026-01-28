
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import { auth } from '@/auth';
import { logActivity } from "@/lib/audit";

export async function GET() {
    await dbConnect();
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({}); // Create with defaults if none exists
        }
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Fetch settings error:", error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await auth();
    console.log("PATCH API Session:", session);
    console.log("PATCH API Role:", (session?.user as { role?: string })?.role);

    if (!session || (session.user as { role?: string }).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        console.log("PATCH API Body:", body);
        
        let settings = await Settings.findOne();
        
        if (!settings) {
            settings = await Settings.create(body);
        } else {
            settings = await Settings.findOneAndUpdate({}, body, { new: true });
        }
        
        console.log("Updated Settings Result:", settings);

        await logActivity({
            adminId: session.user?.id || '',
            adminName: session.user?.name || 'Admin',
            action: "Updated Site Settings",
            targetType: "Settings",
            details: "Updated global site settings",
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("PATCH Settings Error:", error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
