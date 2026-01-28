import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export async function GET() {
    try {
        await dbConnect();
        
        const testimonials = await Testimonial.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .select('-__v');

        return NextResponse.json(testimonials);
    } catch (error) {
        console.error("Fetch testimonials error:", error);
        return NextResponse.json({ message: "Failed to fetch testimonials" }, { status: 500 });
    }
}
