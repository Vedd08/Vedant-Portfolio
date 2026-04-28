import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // Can be an SVG string, class name, or image URL
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
