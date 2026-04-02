import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is too short"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

/**
 * POST handler to process contact form submissions.
 * Performs schema validation using Zod and handles incoming inquiries.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    
    const result = contactSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    console.log('Contact Form Submission:', { name, email, subject, message });

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
