import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Job from "@/models/Job";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        let settings = await SiteSettings.findOne();
        
        // If no settings exist, return defaults
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
                heroTitle: settings.heroTitle,
                heroSubtitle: settings.heroSubtitle,
                heroImage: settings.heroImage,
                totalJobsDisplay: totalJobs,
                totalCompaniesDisplay: totalCompanies,
                totalCandidatesDisplay: totalCandidates,
                useRealStats: settings.useRealStats
            });
        }

        return NextResponse.json({
            heroTitle: settings.heroTitle,
            heroSubtitle: settings.heroSubtitle,
            heroImage: settings.heroImage,
            totalJobsDisplay: settings.totalJobsDisplay,
            totalCompaniesDisplay: settings.totalCompaniesDisplay,
            totalCandidatesDisplay: settings.totalCandidatesDisplay,
            useRealStats: settings.useRealStats
        });
    } catch (error) {
        console.error("Fetch site settings error:", error);
        return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
    }
}
