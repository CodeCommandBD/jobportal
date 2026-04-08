import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

/**
 * GET - Fetch all notifications for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Fetch latest 20 notifications
    const notifications = await Notification.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH - Mark notifications as read.
 * If notificationIds array is provided, mark those specific ones.
 * Otherwise, mark all as read.
 */
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { notificationIds } = body;

    const query = { userId: session.user.id, isRead: false };
    if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      query._id = { $in: notificationIds };
    }

    await Notification.updateMany(query, { $set: { isRead: true } });

    return NextResponse.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
