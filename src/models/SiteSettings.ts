import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
    // Hero Section
    heroTitle: {
        type: String,
        default: 'Find Your Dream Job Today'
    },
    heroSubtitle: {
        type: String,
        default: 'Discover thousands of job opportunities with all the information you need.'
    },
    heroImage: {
        type: String,
        default: '/hero-bg.jpg'
    },
    
    // Stats Section
    totalJobsDisplay: {
        type: Number,
        default: 0
    },
    totalCompaniesDisplay: {
        type: Number,
        default: 0
    },
    totalCandidatesDisplay: {
        type: Number,
        default: 0
    },
    useRealStats: {
        type: Boolean,
        default: true // If true, use actual DB counts; if false, use manual numbers
    },
    
    // Meta
    updatedBy: {
        type: String,
        default: 'Admin'
    }
}, {
    timestamps: true
});

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
