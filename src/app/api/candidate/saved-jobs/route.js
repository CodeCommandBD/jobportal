import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Job from '@/models/Job';

/**
 * GET - Fetch all jobs saved by the logged-in candidate.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Find the current user to get their savedJobs array
    const user = await User.findOne({ email: session.user.email }).lean();
    
    if (!user || !user.savedJobs || user.savedJobs.length === 0) {
      return NextResponse.json([]); // Return empty array if user has no saved jobs
    }

    // Fetch the actual Job documents corresponding to those IDs
    // Ordered by recently created jobs first
    const savedJobs = await Job.find({ 
      _id: { $in: user.savedJobs } 
    })
    .populate('employerId', 'name image isVerified')
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json(savedJobs);
  } catch (error) {
    console.error('Fetch saved jobs error:', error);
    return NextResponse.json({ message: 'Failed to fetch saved jobs' }, { status: 500 });
  }
}
