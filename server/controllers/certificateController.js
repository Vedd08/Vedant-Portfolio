import Certificate from "../models/Certificate.js";

// GET all certificates
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD certificate
export const addCertificate = async (req, res) => {
  try {
    const certificateData = { ...req.body };
    if (req.file) {
      certificateData.imageUrl = req.file.path;
    }
    const certificate = new Certificate(certificateData);
    const saved = await certificate.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE certificate
export const deleteCertificate = async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
