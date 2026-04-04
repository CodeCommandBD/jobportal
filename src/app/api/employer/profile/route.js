import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

/**
 * GET handler to fetch employer's company profile.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const employer = await User.findById(session.user.id)
      .select('name email image companyName companyLogo companyDescription companyWebsite companySize companyIndustry')
      .lean();

    return NextResponse.json(employer);
  } catch (error) {
    console.error('Fetch employer profile error:', error);
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 });
  }
}

/**
 * PATCH handler to update employer's company profile.
 */
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();

    const allowedFields = [
      'companyName', 'companyLogo', 'companyDescription',
      'companyWebsite', 'companySize', 'companyIndustry', 'image',
    ];

    const updates = {};
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) updates[key] = body[key];
    });

    const updated = await User.findByIdAndUpdate(session.user.id, updates, { new: true })
      .select('name email image companyName companyLogo companyDescription companyWebsite companySize companyIndustry');

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update employer profile error:', error);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}
