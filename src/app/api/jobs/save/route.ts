
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Toggle saved status
    if (!user.savedJobs) {
        user.savedJobs = [];
    }

    const isSaved = user.savedJobs.some((id) => id.toString() === jobId);

    if (isSaved) {
        user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
        user.savedJobs.push(jobId);
    }

    await user.save();

    return NextResponse.json(
      { 
        message: isSaved ? 'Job removed from saved list' : 'Job saved successfully',
        isSaved: !isSaved 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error toggling saved job:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
