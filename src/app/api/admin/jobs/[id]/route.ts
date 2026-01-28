
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { auth } from "@/auth";

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
