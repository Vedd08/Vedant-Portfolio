import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String],
  liveLink: String,
  githubLink: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Project", projectSchema);