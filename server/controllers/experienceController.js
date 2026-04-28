import Experience from "../models/Experience.js";

// GET all experiences
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD experience
export const addExperience = async (req, res) => {
  try {
    const experienceData = { ...req.body };
    // Assuming skills comes as a comma separated string, split it into an array
    if (typeof experienceData.skills === 'string') {
      experienceData.skills = experienceData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
    }
    
    const experience = new Experience(experienceData);
    const saved = await experience.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE experience
export const deleteExperience = async (req, res) => {
  try {
    const removed = await Experience.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
