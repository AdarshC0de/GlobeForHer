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
  const photo = await Photo.create({
    url: req.file.path,       // Cloudinary URL
    public_id: req.file.filename,
  });

  res.json(photo);
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