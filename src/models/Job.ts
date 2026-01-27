
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: 'Full Time' | 'Part Time' | 'Remote' | 'Contract' | 'Internship';
  salaryRange?: string;
  category: string;
  urgency: 'Normal' | 'Urgent';
  skills: string[];
  employerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema<IJob> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    jobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Remote', 'Contract', 'Internship'],
      required: true,
    },
    salaryRange: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent'],
      default: 'Normal',
    },
    skills: {
      type: [String],
      default: [],
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
