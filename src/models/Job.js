
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job;
