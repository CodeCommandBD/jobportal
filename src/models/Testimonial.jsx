import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

export default Testimonial;
