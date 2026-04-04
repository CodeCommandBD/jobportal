import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

/**
 * POST handler to upload a resume PDF to Cloudinary and save the URL to the user profile.
 * Accepts multipart/form-data with a 'resume' file field.
 */
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ message: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Convert file to buffer and base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64}`;

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload`;

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', dataUri);
    cloudinaryFormData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'jobportal_resumes');
    cloudinaryFormData.append('resource_type', 'raw');
    cloudinaryFormData.append('folder', 'resumes');
    cloudinaryFormData.append('public_id', `resume_${session.user.id}_${Date.now()}`);

    const cloudinaryRes = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    if (!cloudinaryRes.ok) {
      const err = await cloudinaryRes.json();
      console.error('Cloudinary Error:', err);
      return NextResponse.json({ message: 'Failed to upload to Cloudinary' }, { status: 500 });
    }

    const cloudinaryData = await cloudinaryRes.json();
    const resumeUrl = cloudinaryData.secure_url;

    // Save the URL to the user's profile
    await dbConnect();
    await User.findByIdAndUpdate(session.user.id, { resumeUrl });

    return NextResponse.json({ resumeUrl, message: 'Resume uploaded successfully' });
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
