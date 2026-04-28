import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  page: {
    type: String,
    default: 'home',
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  userAgent: String,
  ip: {
    type: String,
    index: true
  },
  referer: String,
  sessionId: String,
  isUnique: {
    type: Boolean,
    default: true
  }
});

// Compound index for faster queries
viewSchema.index({ timestamp: -1, ip: 1 });
viewSchema.index({ page: 1, timestamp: -1 });

export default mongoose.model("View", viewSchema);