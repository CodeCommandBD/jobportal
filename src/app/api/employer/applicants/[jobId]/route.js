
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import { auth } from "@/auth";

/**
 * GET handler to retrieve all applications for a specific job post.
 * Restricts access to the employer who posted the job.
 */
export async function GET(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'employer') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { jobId } = await params;
        await dbConnect();

        const applicants = await Application.find({ jobId, employerId: session.user.id })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email image')
            .lean();

        return NextResponse.json(applicants);
    } catch (error) {
        console.error("Fetch applicants error:", error);
        return NextResponse.json({ message: "Failed to fetch applicants" }, { status: 500 });
    }
}
