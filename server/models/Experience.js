import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
