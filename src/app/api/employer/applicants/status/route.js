
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import { auth } from "@/auth";

/**
 * PATCH handler to update the status of a specific job application.
 * Verifies employer ownership before applying status changes.
 */
export async function PATCH(req) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'employer') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { applicationId, status } = await req.json();
        await dbConnect();

        const updatedApplication = await Application.findOneAndUpdate(
            { _id: applicationId, employerId: session.user.id },
            { status },
            { new: true }
        );

        if (!updatedApplication) {
            return NextResponse.json({ message: "Application not found" }, { status: 404 });
        }

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error("Update application status error:", error);
        return NextResponse.json({ message: "Failed to update status" }, { status: 500 });
    }
}
