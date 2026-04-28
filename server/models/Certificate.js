import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  credentialUrl: {
    type: String,
    required: false,
  }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
