
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();
        const logs = await AuditLog.find({})
            .sort({ createdAt: -1 })
            .limit(500); // Historical audit trail

        return NextResponse.json(logs);
    } catch (error) {
        console.error("Fetch logs error:", error);
        return NextResponse.json({ message: "Failed to fetch logs" }, { status: 500 });
    }
}
