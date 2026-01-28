
import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  showChat: boolean;
  maxJobsPerEmployer: number;
}

const SettingsSchema: Schema = new Schema({
  siteName: { type: String, default: 'DevHire Job Portal' },
  siteDescription: { type: String, default: 'Find your dream job in tech.' },
  contactEmail: { type: String, default: 'support@devhire.com' },
  maintenanceMode: { type: Boolean, default: false },
  showChat: { type: Boolean, default: false },
  maxJobsPerEmployer: { type: Number, default: 10 },
}, { timestamps: true });

if (mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.model<ISettings>('Settings', SettingsSchema);
