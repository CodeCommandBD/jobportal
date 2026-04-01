import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import Category from "@/models/Category";
import { auth } from "@/auth";
import { logActivity } from "@/lib/audit";

export async function GET() {
    try {
        await dbConnect();
        
        const categories = await Category.find({}).lean();
        
        const counts = await Job.aggregate([
            { $match: { status: 'approved' } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        const categoryCounts = counts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        const categoriesWithCounts = categories.map((cat) => ({
            ...cat,
            count: categoryCounts[cat.name] || 0
        }));

        return NextResponse.json(categoriesWithCounts);
    } catch (error) {
        console.error("Fetch categories error:", error);
        return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();
        const newCategory = await Category.create(body);
        
        await logActivity({
            adminId: session.user?.id || '',
            adminName: session.user?.name || 'Admin',
            action: "Created Category",
            targetType: "Category",
            details: `Created category: ${newCategory.name}`,
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("Create category error:", error);
        if (error.code === 11000) {
            return NextResponse.json({ message: "Category already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
    }
}
