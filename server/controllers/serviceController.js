import Service from "../models/Service.js";

// GET all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD service
export const addService = async (req, res) => {
  try {
    const serviceData = { ...req.body };
    if (req.file) {
      serviceData.icon = req.file.path;
    }
    const service = new Service(serviceData);
    const saved = await service.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE service
export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
