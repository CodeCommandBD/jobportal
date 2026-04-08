
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

    // ── Fire-and-forget: send alert emails to matching candidates ──
    // We only send alerts when job is approved (admin approves). But we
    // also trigger when employer posts (notify pre-existing alerts subscribers).
    triggerJobAlerts(newJob).catch(err =>
      console.error('Job alert email error (non-blocking):', err)
    );

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ message: "Error creating job" }, { status: 500 });
  }
}

/**
 * Finds all active JobAlerts matching the new job and sends email notifications.
 * Runs asynchronously and does not block the HTTP response.
 */
async function triggerJobAlerts(job) {
  try {
    const JobAlert = (await import('@/models/JobAlert')).default;
    const User = (await import('@/models/User')).default;
    const { sendJobAlertEmail } = await import('@/lib/email');

    // Build an OR query to match any relevant alerts
    const matchQuery = {
      isActive: true,
      $or: [
        { category: job.category },
        { jobType: job.jobType },
        { keyword: { $regex: job.title, $options: 'i' } },
      ],
    };

    const matchingAlerts = await JobAlert.find(matchQuery).lean();
    if (!matchingAlerts.length) return;

    // Get all unique user IDs
    const userIds = [...new Set(matchingAlerts.map(a => a.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } }).select('name email').lean();
    const userMap = users.reduce((acc, u) => { acc[u._id.toString()] = u; return acc; }, {});

    // Send email to each unique user (deduped)
    const notified = new Set();
    for (const alert of matchingAlerts) {
      const uid = alert.userId.toString();
      if (notified.has(uid)) continue;
      const user = userMap[uid];
      if (!user?.email) continue;

      await sendJobAlertEmail({ to: user.email, candidateName: user.name, job });
      notified.add(uid);
    }

    console.log(`✅ Sent job alerts to ${notified.size} candidates`);
  } catch (err) {
    console.error('triggerJobAlerts failed:', err);
  }
}
