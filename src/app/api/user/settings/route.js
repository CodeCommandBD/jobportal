import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * PATCH - Update user settings (password)
 */
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Both current and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'New password must be at least 6 characters' }, { status: 400 });
    }

    await dbConnect();
    
    // Explicitly select password field since it might be excluded by default
    const user = await User.findById(session.user.id).select('+password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user was registered via OAuth (might not have a password)
    if (!user.password) {
      return NextResponse.json({ message: 'Account is linked to a social login. Please set a password first or use social login.' }, { status: 400 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 401 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
