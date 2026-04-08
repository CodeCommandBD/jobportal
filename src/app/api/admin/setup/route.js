import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/**
 * Temporary Setup API to promote the currently logged-in user to Admin.
 * Usage: Log in normally, then visit /api/admin/setup in your browser.
 * IMPORTANT: Delete this file after initial setup for security!
 */
export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ message: "Error: You must be logged in first as a normal user." }, { status: 401 });
        }

        await dbConnect();
        
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { role: 'admin' },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found in database." }, { status: 404 });
        }

        return NextResponse.json({ 
            status: "Success",
            message: `Congratulations ${updatedUser.name}! Your role has been updated to 'admin'.`,
            instructions: "Please Logout from the website and Login again to refresh your session data.",
            role: updatedUser.role
        });
    } catch (error) {
        console.error("Admin setup error:", error);
        return NextResponse.json({ message: "Failed to update role", error: error.message }, { status: 500 });
    }
}
