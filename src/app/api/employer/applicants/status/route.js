
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import { auth } from "@/auth";

const VALID_STATUSES = ['pending', 'shortlisted', 'interview', 'hired', 'rejected'];

/**
 * PATCH handler to update the ATS pipeline status of a specific job application.
 * Supports status, interviewDate, and employerNote updates.
 * Verifies employer ownership before applying changes.
 */
export async function PATCH(req) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'employer') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { applicationId, status, interviewDate, employerNote } = body;

        if (status && !VALID_STATUSES.includes(status)) {
            return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
        }

        const updateFields = {};
        if (status) updateFields.status = status;
        if (interviewDate !== undefined) updateFields.interviewDate = interviewDate;
        if (employerNote !== undefined) updateFields.employerNote = employerNote;

        await dbConnect();

        const updatedApplication = await Application.findOneAndUpdate(
            { _id: applicationId, employerId: session.user.id },
            updateFields,
            { new: true }
        ).populate('userId', 'name email image title').populate('jobId', 'title');

        if (!updatedApplication) {
            return NextResponse.json({ message: "Application not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error("Update application status error:", error);
        return NextResponse.json({ message: "Failed to update status" }, { status: 500 });
    }
}
