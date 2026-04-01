import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Application from '@/models/Application';

export async function POST(req) {
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

    const existingApplication = await Application.findOne({ 
        userId: session.user.id,
        jobId 
    });

    if (existingApplication) {
        return NextResponse.json({ message: 'You have already applied for this job' }, { status: 400 });
    }

    const newApplication = new Application({
        jobId,
        jobTitle,
        employerId,
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        resumeUrl: '',
        status: 'pending'
    });

    await newApplication.save();

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
