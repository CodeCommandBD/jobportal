
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {};

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
        const isAdmin = (session?.user as { role?: string })?.role === 'admin';
        
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
      employerId: session.user.id,
      status: 'pending', // Force pending for new jobs
    });
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ message: "Error creating job" }, { status: 500 });
  }
}
