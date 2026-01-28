
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { auth } from "@/auth";
import { logActivity } from "@/lib/audit";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();
        const deletedJob = await Job.findByIdAndDelete(params.id);

        if (!deletedJob) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Job deleted successfuly" });
    } catch (error) {
        console.error("Delete job error:", error);
        return NextResponse.json({ message: "Failed to delete job" }, { status: 500 });
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        await dbConnect();
        const updatedJob = await Job.findByIdAndUpdate(params.id, body, { new: true });

        if (!updatedJob) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        // Log the activity
        let action = "Updated Job";
        if (body.status && body.status !== 'pending') {
            action = body.status === 'approved' ? "Job Approved" : "Job Rejected";
        } else if (body.isFeatured !== undefined) {
            action = body.isFeatured ? "Job Featured" : "Job Unfeatured";
        }

        await logActivity({
            adminId: session.user?.id || '',
            adminName: session.user?.name || 'Admin',
            action,
            targetId: params.id,
            targetType: "Job",
            details: `${action}: ${updatedJob.title}`,
        });

        return NextResponse.json(updatedJob);
    } catch (error) {
        console.error("Update job error:", error);
        return NextResponse.json({ message: "Failed to update job" }, { status: 500 });
    }
}
