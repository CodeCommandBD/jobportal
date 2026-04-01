
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'jobseeker') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();

        const userId = session.user.id;

        const applications = await Application.find({ userId })
            .sort({ createdAt: -1 })
            .populate('jobId', 'title company location logo')
            .lean();

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Fetch candidate applications error:", error);
        return NextResponse.json({ message: "Failed to fetch applications" }, { status: 500 });
    }
}
