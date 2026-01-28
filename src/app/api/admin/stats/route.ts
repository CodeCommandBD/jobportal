import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Job from "@/models/Job";
import AuditLog from "@/models/AuditLog";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();

        const [totalJobs, totalUsers, totalEmployers, totalJobseekers, pendingJobs, unverifiedEmployers, recentLogs] = await Promise.all([
            Job.countDocuments(),
            User.countDocuments(),
            User.countDocuments({ role: 'employer' }),
            User.countDocuments({ role: 'jobseeker' }),
            Job.countDocuments({ status: 'pending' }),
            User.countDocuments({ role: 'employer', isVerified: false }),
            AuditLog.find().sort({ createdAt: -1 }).limit(5).lean()
        ]);

        // Fetch growth data for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [jobGrowth, userGrowth] = await Promise.all([
            Job.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            User.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        // Format chart data
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            
            const jobCount = jobGrowth.find(g => g._id === dateStr)?.count || 0;
            const userCount = userGrowth.find(g => g._id === dateStr)?.count || 0;
            
            chartData.push({
                name: dateStr,
                jobs: jobCount,
                users: userCount
            });
        }

        return NextResponse.json({
            totalJobs,
            totalUsers,
            totalEmployers,
            totalJobseekers,
            pendingJobs,
            unverifiedEmployers,
            recentLogs,
            chartData
        });
    } catch (error) {
        console.error("Fetch admin stats error:", error);
        return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 });
    }
}
