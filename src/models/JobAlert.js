import mongoose from 'mongoose';

const JobAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: { type: String },
    jobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Remote', 'Contract', 'Internship', 'Any'],
      default: 'Any',
    },
    location: { type: String },
    keyword: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const JobAlert = mongoose.models.JobAlert || mongoose.model('JobAlert', JobAlertSchema);

export default JobAlert;
