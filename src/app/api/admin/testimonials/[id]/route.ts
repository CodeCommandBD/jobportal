import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { auth } from "@/auth";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await auth();
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        await dbConnect();

        const testimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true });

        if (!testimonial) {
            return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error("Update testimonial error:", error);
        return NextResponse.json({ message: "Failed to update testimonial" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await auth();
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();
        const testimonial = await Testimonial.findByIdAndDelete(id);

        if (!testimonial) {
            return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        console.error("Delete testimonial error:", error);
        return NextResponse.json({ message: "Failed to delete testimonial" }, { status: 500 });
    }
}
