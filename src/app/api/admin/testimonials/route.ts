import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();
        const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });

        return NextResponse.json(testimonials);
    } catch (error) {
        console.error("Fetch testimonials error:", error);
        return NextResponse.json({ message: "Failed to fetch testimonials" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as { role?: string }).role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        await dbConnect();

        const testimonial = await Testimonial.create(body);

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        console.error("Create testimonial error:", error);
        return NextResponse.json({ message: "Failed to create testimonial" }, { status: 500 });
    }
}
