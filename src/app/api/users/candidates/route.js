import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

/**
 * GET handler to fetch all registered candidates with the 'jobseeker' role.
 * Retrieves key profile information including skills, bio, and location.
 */
export async function GET(req) {
  try {
    await dbConnect();
    
    const candidates = await User.find({ role: 'jobseeker' })
      .select('name email image jobPost skills bio title location')
      .lean();

    return NextResponse.json(candidates, { status: 200 });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
