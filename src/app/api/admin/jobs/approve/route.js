import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import AuditLog from '@/models/AuditLog';

/**
 * PATCH - Approve or reject a featured job request
 */
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { jobId, isApproved } = await req.json();

    if (!jobId || typeof isApproved !== 'boolean') {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    await dbConnect();
    
    const job = await Job.findById(jobId).populate('employerId', 'name email');
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    // Process the approval/rejection
    if (isApproved) {
      job.isFeatured = true;
      job.featuredRequest = false; // Reset request flag since it's processed
    } else {
      job.isFeatured = false;
      job.featuredRequest = false; // Denied, so reset the flag
    }

    await job.save();

    // Log the admin action
    await AuditLog.create({
        action: `Featured request ${isApproved ? 'approved' : 'rejected'} for Job: ${job.title}`,
        userId: session.user.id
    });

    // Create In-App Notification
    try {
        const Notification = (await import('@/models/Notification')).default;
        await Notification.create({
            userId: job.employerId._id,
            title: isApproved ? 'Featured Job Approved' : 'Featured Job Declined',
            message: `Your request to feature the job '${job.title}' has been ${isApproved ? 'approved' : 'declined'}.`,
            type: isApproved ? 'success' : 'error',
            link: `/dashboard/employer/jobs`
        });
    } catch (e) { console.error('In-app notification error:', e); }

    // Fire & Forget Email Notification to Employer (Optional enhancement)
    try {
        const { createTransporter, FROM_ADDRESS } = await import('@/lib/email');
        if (process.env.EMAIL_USER && job.employerId?.email) {
            const transporter = createTransporter();
            const subject = isApproved ? '🎉 Your Job is now Featured!' : 'Update regarding your Featured Job request';
            const html = `
              <div style="font-family: Arial; padding: 20px;">
                  <h2>Hi ${job.employerId.name},</h2>
                  <p>Your request to feature the job <strong>${job.title}</strong> has been <strong>${isApproved ? 'APPROVED' : 'DECLINED'}</strong> by the admin.</p>
                  ${isApproved ? '<p>Your job will now appear with a Featured badge and get prioritized visibility!</p>' : ''}
              </div>
            `;
            transporter.sendMail({ from: FROM_ADDRESS, to: job.employerId.email, subject, html }).catch(console.error);
        }
    } catch (e) { console.error('Email error:', e); }

    return NextResponse.json({ message: `Featured request ${isApproved ? 'approved' : 'rejected'} successfully.` });
  } catch (error) {
    console.error('Approve job error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
