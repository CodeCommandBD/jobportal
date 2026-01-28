import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Use aggregation to just get the jobIds
    // We need to find the user ID first, or we can assume we might have it in session
    // But relying on session.user.id if available is better, or query by email if needed.
    // However, Application model stores userId and userEmail. userEmail is safer if id is not robust.
    
    // Let's assume we query by email for safety if ID is not guaranteed in session always
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
