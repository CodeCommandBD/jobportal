
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'jobseeker' | 'employer' | 'admin';
  status: 'active' | 'banned';
  isVerified: boolean;
  image?: string;
  provider?: string;
  savedJobs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
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
      select: false, // Don't return password by default
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      default: 'credentials',
    },
    savedJobs: [{
        type: Schema.Types.ObjectId,
        ref: 'Job',
        default: [],
    }],
  },
  {
    timestamps: true,
  }
);

// Prevent overwriting the model if it's already compiled
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
