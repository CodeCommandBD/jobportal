
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { auth } from "@/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const title = searchParams.get('title');
        const location = searchParams.get('location');
        const category = searchParams.get('category');

        let query: any = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }

        // Public users only see approved jobs
        const session = await auth();
        const isAdmin = (session?.user as any)?.role === 'admin';
        
        if (!isAdmin) {
            query.status = 'approved';
        }

        const jobs = await Job.find(query).sort({ isFeatured: -1, createdAt: -1 });
        return NextResponse.json(jobs);
    } catch (error) {
        console.error("Fetch jobs error:", error);
        return NextResponse.json({ message: "Failed to fetch jobs" }, { status: 500 });
    }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await req.json();
    const newJob = await Job.create({
      ...body,
      employerId: (session.user as any).id,
      status: 'pending', // Force pending for new jobs
    });
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating job" }, { status: 500 });
  }
}
