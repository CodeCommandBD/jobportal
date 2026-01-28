import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '/default-avatar.png'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    comment: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

export default Testimonial;
