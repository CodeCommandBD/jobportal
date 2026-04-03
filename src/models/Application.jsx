
import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interviewing', 'accepted', 'rejected'],
      default: 'pending',
    },
    coverLetter: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export default Application;
