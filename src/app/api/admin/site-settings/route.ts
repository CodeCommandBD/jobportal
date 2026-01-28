import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Job from "@/models/Job";
import User from "@/models/User";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();

        let settings = await SiteSettings.findOne();
        
        // If no settings exist, create default
        if (!settings) {
            settings = await SiteSettings.create({
                heroTitle: 'Find Your Dream Job Today',
                heroSubtitle: 'Discover thousands of job opportunities with all the information you need.',
                useRealStats: true
            });
        }

        // If using real stats, fetch actual counts
        if (settings.useRealStats) {
            const [totalJobs, totalCompanies, totalCandidates] = await Promise.all([
                Job.countDocuments({ status: 'approved' }),
                User.countDocuments({ role: 'employer' }),
                User.countDocuments({ role: 'jobseeker' })
            ]);

            return NextResponse.json({
                ...settings.toObject(),
                totalJobsDisplay: totalJobs,
                totalCompaniesDisplay: totalCompanies,
                totalCandidatesDisplay: totalCandidates
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Fetch site settings error:", error);
        return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        await dbConnect();

        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create({
                ...body,
                updatedBy: session.user?.name || 'Admin'
            });
        } else {
            settings = await SiteSettings.findOneAndUpdate(
                {},
                { ...body, updatedBy: session.user?.name || 'Admin' },
                { new: true }
            );
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Update site settings error:", error);
        return NextResponse.json({ message: "Failed to update settings" }, { status: 500 });
    }
}
