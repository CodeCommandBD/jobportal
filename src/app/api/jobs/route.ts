
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { auth } from "@/auth";

export async function GET() {
  await dbConnect();
  try {
    const jobs = await Job.find().populate("employerId", "name email image").sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await req.json();
    const newJob = await Job.create({
      ...body,
      employerId: (session.user as any).id,
    });
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating job" }, { status: 500 });
  }
}
