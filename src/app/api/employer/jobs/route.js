import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import Application from '@/models/Application';

/**
 * GET - Fetch all jobs posted by the logged-in employer.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    
    // Fetch all jobs for this employer, sorted by newest
    const jobs = await Job.find({ employerId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Get applicant counts for each job
    const jobIds = jobs.map(j => j._id);
    const applicantCounts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } }
    ]);

    const countMap = applicantCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const jobsWithCounts = jobs.map(job => ({
      ...job,
      applicantCount: countMap[job._id.toString()] || 0
    }));

    return NextResponse.json(jobsWithCounts);
  } catch (error) {
    console.error('Fetch employer jobs error:', error);
    return NextResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
  }
}
