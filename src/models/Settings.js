
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'DevHire Job Portal' },
  siteDescription: { type: String, default: 'Find your dream job in tech.' },
  contactEmail: { type: String, default: 'support@devhire.com' },
  maintenanceMode: { type: Boolean, default: false },
  showChat: { type: Boolean, default: false },
  maxJobsPerEmployer: { type: Number, default: 10 },
  metaKeywords: { type: String, default: 'jobs, tech, developer, hiring, recruitment' },
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
