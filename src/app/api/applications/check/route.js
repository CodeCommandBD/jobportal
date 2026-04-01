import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';

export async function GET(req) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const applications = await Application.find({ userEmail: session.user.email }).select('jobId');
    
    const appliedJobIds = applications.map(app => app.jobId);

    return NextResponse.json(
      { 
        appliedJobIds 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
