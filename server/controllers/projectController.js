import Project from "../models/Project.js";

// GET all projects
export const getProjects = async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
};

// ADD project
export const addProject = async (req, res) => {
  const project = new Project(req.body);
  const saved = await project.save();
  res.json(saved);
};

// DELETE project
export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};