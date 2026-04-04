import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Job from '@/models/Job';

/**
 * GET - Fetch a company's public profile and active job listings by employer ID.
 */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const employer = await User.findById(id)
      .select('name image companyName companyLogo companyDescription companyWebsite companySize companyIndustry createdAt')
      .lean();

    if (!employer || employer.role === 'jobseeker') {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    const jobs = await Job.find({ employerId: id, status: 'approved' })
      .sort({ createdAt: -1 })
      .select('title location jobType salaryRange category urgency isFeatured createdAt')
      .lean();

    return NextResponse.json({ employer, jobs });
  } catch (error) {
    console.error('Fetch company profile error:', error);
    return NextResponse.json({ message: 'Failed to fetch company profile' }, { status: 500 });
  }
}
