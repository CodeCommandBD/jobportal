import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import JobAlert from '@/models/JobAlert';

/**
 * GET - Fetch all active alerts for the current user.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const alerts = await JobAlert.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Fetch alerts error:', error);
    return NextResponse.json({ message: 'Failed to fetch alerts' }, { status: 500 });
  }
}

/**
 * POST - Create a new job alert for the current user.
 */
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    await dbConnect();

    const alert = await JobAlert.create({
      userId: session.user.id,
      category: body.category || null,
      jobType: body.jobType || 'Any',
      location: body.location || null,
      keyword: body.keyword || null,
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error('Create alert error:', error);
    return NextResponse.json({ message: 'Failed to create alert' }, { status: 500 });
  }
}

/**
 * DELETE - Remove a job alert by ID.
 */
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const alertId = searchParams.get('id');

    if (!alertId) return NextResponse.json({ message: 'Alert ID required' }, { status: 400 });

    await dbConnect();
    await JobAlert.findOneAndDelete({ _id: alertId, userId: session.user.id });

    return NextResponse.json({ message: 'Alert deleted' });
  } catch (error) {
    console.error('Delete alert error:', error);
    return NextResponse.json({ message: 'Failed to delete alert' }, { status: 500 });
  }
}
