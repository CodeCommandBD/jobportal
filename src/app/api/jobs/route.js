
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { auth } from "@/auth";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);

        // Pagination parameters
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Filtering parameters
        const title = searchParams.get('title');
        const location = searchParams.get('location');
        const category = searchParams.get('category');
        const jobType = searchParams.get('jobType');
        const urgency = searchParams.get('urgency');
        const minSalary = searchParams.get('minSalary');
        const featured = searchParams.get('featured');

        // Sorting
        const sort = searchParams.get('sort') || '-createdAt';

        const query = {};

        // Deep Search Logic
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (category && category !== 'All') {
            query.category = category;
        }
        if (jobType && jobType !== 'All') {
            query.jobType = jobType;
        }
        if (urgency) {
            query.urgency = urgency;
        }
        if (minSalary) {
            // Assuming salaryRange is stored as a string like "50k-70k" 
            // Better to have a numeric field, but for now we regex or use a logical check if possible
            // If data grows, we should store salary as numbers.
            query.salaryRange = { $regex: minSalary, $options: 'i' }; 
        }
        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Role-based visibility
        const session = await auth();
        const isAdmin = session?.user?.role === 'admin';
        
        if (!isAdmin) {
            query.status = 'approved';
        }

        // Execute query with pagination and sort
        const jobs = await Job.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Job.countDocuments(query);

        return NextResponse.json({
            jobs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Fetch jobs error:", error);
        return NextResponse.json({ message: "Failed to fetch jobs" }, { status: 500 });
    }
}

export async function POST(req) {
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
      status: 'pending', 
    });
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ message: "Error creating job" }, { status: 500 });
  }
}
