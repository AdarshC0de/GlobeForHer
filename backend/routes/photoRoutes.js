const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Photo = require("../models/photo");

const router = express.Router();

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "globe-photos",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// GET photos
router.get("/", async (req, res) => {
  const photos = await Photo.find().sort({ createdAt: -1 });
  res.json(photos);
});

// Upload photo
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const index = await Photo.countDocuments();

    const total = 500; // controls spread density
    const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);

    const lat = 90 - (phi * 180) / Math.PI;
    const lng = (theta * 180) / Math.PI;

    const photo = await Photo.create({
      url: req.file.path,
      public_id: req.file.filename,
      lat,
      lng,
    });

    res.json(photo);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete photo
router.delete("/:id", async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  if (!photo) return res.status(404).json({ message: "Not found" });

  await cloudinary.uploader.destroy(photo.public_id);
  await Photo.findByIdAndDelete(req.params.id);

  res.json({ message: "Deleted" });
});

module.exports = router;