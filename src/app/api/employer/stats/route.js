
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import Application from "@/models/Application";
import { auth } from "@/auth";

/**
 * GET handler to aggregate dashboard statistics for an employer.
 * Provides counts for total jobs, active listings, and application metrics.
 */
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'employer') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();

        const employerId = session.user.id;

        const [totalJobs, activeJobs, totalApplications, pendingApplications] = await Promise.all([
            Job.countDocuments({ employer: employerId }),
            Job.countDocuments({ employer: employerId, status: 'approved' }),
            Application.countDocuments({ employerId: employerId }),
            Application.countDocuments({ employerId: employerId, status: 'pending' })
        ]);

        // Get recent applications
        const recentApplications = await Application.find({ employerId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('jobId', 'title')
            .populate('userId', 'name email image')
            .lean();

        return NextResponse.json({
            totalJobs,
            activeJobs,
            totalApplications,
            pendingApplications,
            recentApplications
        });
    } catch (error) {
        console.error("Fetch employer stats error:", error);
        return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
    }
}
