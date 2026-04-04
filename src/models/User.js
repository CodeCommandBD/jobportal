
import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  degree: { type: String },
  institution: { type: String },
  fieldOfStudy: { type: String },
  startYear: { type: String },
  endYear: { type: String },
}, { _id: true });

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ['jobseeker', 'employer', 'admin'],
      default: 'jobseeker',
    },
    status: {
      type: String,
      enum: ['active', 'banned'],
      default: 'active',
    },
    isVerified: { type: Boolean, default: false },
    image: { type: String },
    provider: { type: String, default: 'credentials' },

    // --- Jobseeker Profile Fields ---
    title: { type: String },        // e.g. "Senior Frontend Engineer"
    location: { type: String },
    bio: { type: String },
    skills: { type: [String], default: [] },
    yearsOfExperience: { type: Number, default: 0 },
    resumeUrl: { type: String },    // Cloudinary PDF URL
    github: { type: String },
    linkedin: { type: String },
    portfolio: { type: String },
    education: { type: [EducationSchema], default: [] },

    savedJobs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: [],
    }],

    // --- Employer / Company Fields ---
    companyName: { type: String },
    companyLogo: { type: String },
    companyDescription: { type: String },
    companyWebsite: { type: String },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    },
    companyIndustry: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
