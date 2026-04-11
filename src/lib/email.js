import nodemailer from 'nodemailer';

/**
 * Creates a reusable Nodemailer transporter.
 * Configured via environment variables for security.
 */
export const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const FROM_ADDRESS = `"Job Portal" <${process.env.EMAIL_USER}>`;

/**
 * Sends a job alert notification email to a candidate 
 * when a new matching job has been posted.
 */
export async function sendJobAlertEmail({ to, candidateName, job }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not set — skipping job alert email');
    return;
  }

  const transporter = createTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">
            🔔 New Job Match!
          </h1>
          <p style="color: #c4b5fd; margin: 8px 0 0; font-size: 14px;">
            A new job matching your alert has been posted
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">
            Hi <strong>${candidateName}</strong>,
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">
            A new job that matches your alert preferences has just been posted. Don't miss this opportunity!
          </p>

          <!-- Job Card -->
          <div style="background: #f8f5ff; border: 1px solid #e9d8fd; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #7c3aed; margin: 0 0 8px; font-size: 20px; font-weight: 800;">
              ${job.title}
            </h2>
            <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 16px;">
              ${job.company}
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <span style="background: #ede9fe; color: #5b21b6; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;">
                📍 ${job.location}
              </span>
              <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;">
                💼 ${job.jobType}
              </span>
              <span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;">
                ${job.category}
              </span>
              ${job.urgency === 'Urgent' ? '<span style="background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;">🔥 Urgent</span>' : ''}
            </div>
            ${job.salaryRange ? `<p style="color: #059669; font-weight: 700; margin: 16px 0 0; font-size: 14px;">💰 ${job.salaryRange}</p>` : ''}
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/job/${job._id}"
               style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 16px; letter-spacing: 0.5px;">
              View Job & Apply →
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px; margin: 0;">
            You received this email because you created a job alert on Job Portal.<br>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/candidate/alerts" style="color: #7c3aed;">Manage your alerts</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: `🔔 New Job Alert: ${job.title} at ${job.company}`,
    html,
  });
}

/**
 * Sends an "Application Status Changed" email to a candidate.
 */
export async function sendStatusUpdateEmail({ to, candidateName, jobTitle, company, status, interviewDate }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not set — skipping status update email');
    return;
  }

  const statusMessages = {
    shortlisted: { emoji: '⭐', label: 'Shortlisted', color: '#1d4ed8', bg: '#dbeafe', text: 'Great news! You have been shortlisted for this role.' },
    interview:   { emoji: '📅', label: 'Interview Scheduled', color: '#6d28d9', bg: '#ede9fe', text: `You have been selected for an interview${interviewDate ? ` on ${new Date(interviewDate).toDateString()}` : ''}.` },
    hired:       { emoji: '🎉', label: 'Congratulations! You\'re Hired', color: '#065f46', bg: '#dcfce7', text: 'You have been selected for this position! The employer will contact you shortly.' },
    rejected:    { emoji: '😔', label: 'Application Update', color: '#991b1b', bg: '#fee2e2', text: 'Unfortunately, the employer has decided to move forward with other candidates.' },
  };

  const info = statusMessages[status] || { emoji: '📋', label: 'Status Updated', color: '#374151', bg: '#f3f4f6', text: 'Your application status has been updated.' };

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${info.emoji}</h1>
          <h2 style="color: white; margin: 8px 0 0; font-size: 20px; font-weight: 900;">${info.label}</h2>
        </div>
        <div style="padding: 32px;">
          <p style="color: #374151;">Hi <strong>${candidateName}</strong>,</p>
          <div style="background: ${info.bg}; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="color: ${info.color}; font-weight: 700; margin: 0 0 8px;">${jobTitle}</p>
            <p style="color: #374151; margin: 0 0 8px;">at <strong>${company}</strong></p>
            <p style="color: ${info.color}; margin: 0;">${info.text}</p>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/candidate"
               style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 800;">
              View My Dashboard →
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: `${info.emoji} Application Update: ${jobTitle} at ${company}`,
    html,
  });
}
