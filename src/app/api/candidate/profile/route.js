
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";

export async function PATCH(req) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const userId = session.user.id;

        await dbConnect();

        // All editable profile fields
        const allowedUpdates = [
            'name', 'image', 'title', 'location', 'skills', 'bio',
            'resumeUrl', 'github', 'linkedin', 'portfolio',
            'yearsOfExperience', 'education',
            // employer fields
            'companyName', 'companyLogo', 'companyDescription',
            'companyWebsite', 'companySize', 'companyIndustry',
        ];

        const updates = {};
        Object.keys(body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = body[key];
            }
        });

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id).select('-password').lean();
        
        return NextResponse.json(user);
    } catch (error) {
        console.error("Fetch profile error:", error);
        return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
    }
}
