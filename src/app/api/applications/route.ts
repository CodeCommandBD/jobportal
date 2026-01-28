
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, jobTitle, employerId } = body;

    if (!jobId || !jobTitle || !employerId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Check if already applied
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingApplication = await Application.findOne({ 
        userId: (session.user as any).id, // Assuming session.user.id exists (populated from token)
        jobId 
    });

    if (existingApplication) {
        return NextResponse.json({ message: 'You have already applied for this job' }, { status: 400 });
    }

    const newApplication = new Application({
        jobId,
        jobTitle,
        employerId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId: (session.user as any).id, // Fallback might be needed if id is missing in logic
        userName: session.user.name,
        userEmail: session.user.email,
        resumeUrl: '', // Could be enhanced to accept resume URL
        status: 'pending'
    });

    await newApplication.save();

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
