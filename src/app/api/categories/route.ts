
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";

export async function GET() {
    try {
        await dbConnect();
        
        const counts = await Job.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Transform into a simple object: { "Category Name": count }
        const categoryCounts = counts.reduce((acc: any, curr: any) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        return NextResponse.json(categoryCounts);
    } catch (error) {
        console.error("Fetch category counts error:", error);
        return NextResponse.json({ message: "Failed to fetch counts" }, { status: 500 });
    }
}
