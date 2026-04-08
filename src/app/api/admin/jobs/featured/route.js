import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';

/**
 * GET - Fetch all jobs that have requested to be featured but are not yet featured.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    
    // Fetch jobs that requested feature but aren't featured yet
    const pendingFeaturedJobs = await Job.find({ 
      featuredRequest: true, 
      isFeatured: false 
    })
      .populate('employerId', 'name email companyName image')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(pendingFeaturedJobs);
  } catch (error) {
    console.error('Fetch pending featured jobs error:', error);
    return NextResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
  }
}
