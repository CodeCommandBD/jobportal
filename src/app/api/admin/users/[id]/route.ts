
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";
import { logActivity } from "@/lib/audit";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await auth();
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { role, status, isVerified } = body;
        
        await dbConnect();
        
        // Prevent admin from banning themselves
        if (session.user?.id === id && status === 'banned') {
            return NextResponse.json({ message: "You cannot ban yourself" }, { status: 400 });
        }

        const oldUser = await User.findById(id);
        if (!oldUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });

        // Log the activity
        let action = "Updated User";
        let details = `Updated user ${oldUser.email}`;

        if (role && role !== oldUser.role) {
            action = "Role Changed";
            details = `Changed ${oldUser.email} role from ${oldUser.role} to ${role}`;
        } else if (status && status !== oldUser.status) {
            action = status === 'banned' ? "User Banned" : "User Unbanned";
            details = `${action} ${oldUser.email}`;
        } else if (isVerified !== undefined && isVerified !== oldUser.isVerified) {
            action = isVerified ? "Employer Verified" : "Employer Unverified";
            details = `${action}: ${oldUser.email}`;
        }

        await logActivity({
            adminId: session.user?.id || '',
            adminName: session.user?.name || 'Admin',
            action,
            targetId: id,
            targetType: "User",
            details,
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
    }
}
