import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';

/**
 * POST - Request a job to be featured (pending admin approval).
 * PATCH - Admin approves/rejects the featured request.
 */
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { jobId } = await req.json();
    if (!jobId) return NextResponse.json({ message: 'Job ID required' }, { status: 400 });

    await dbConnect();

    // Verify the job belongs to this employer
    const job = await Job.findOne({ _id: jobId, employerId: session.user.id });
    if (!job) return NextResponse.json({ message: 'Job not found' }, { status: 404 });

    // Mark as featured pending (uses isFeatured: false + featuredRequest: true)
    job.featuredRequest = true;
    await job.save();

    return NextResponse.json({ message: 'Featured request submitted. Awaiting admin approval.' });
  } catch (error) {
    console.error('Feature request error:', error);
    return NextResponse.json({ message: 'Failed to submit request' }, { status: 500 });
  }
}

/**
 * PATCH - Admin approves or rejects a featured job request.
 */
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { jobId, approve } = await req.json();
    await dbConnect();

    const updateFields = approve
      ? { isFeatured: true, featuredRequest: false }
      : { isFeatured: false, featuredRequest: false };

    await Job.findByIdAndUpdate(jobId, updateFields);

    return NextResponse.json({ message: approve ? 'Job featured!' : 'Featured request rejected.' });
  } catch (error) {
    console.error('Feature approval error:', error);
    return NextResponse.json({ message: 'Failed to update feature status' }, { status: 500 });
  }
}
