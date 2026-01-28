
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Fetch users with role 'jobseeker'
    // Exclude password and sensitive info
    const candidates = await User.find({ role: 'jobseeker' })
      .select('name email image jobPost skills bio title location') // Assuming these fields exist or we add them
      .lean();

    return NextResponse.json(candidates, { status: 200 });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
