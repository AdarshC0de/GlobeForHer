const express = require("express");
const multer = require("multer");
const Photo = require("../models/photo");
const path = require("path");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET all photos
router.get("/", async (req, res) => {
  const photos = await Photo.find().sort({ createdAt: -1 });
  res.json(photos);
});

// Upload photo
router.post("/", upload.single("image"), async (req, res) => {
  const photo = await Photo.create({
    url: `http://localhost:5000/uploads/${req.file.filename}`,
  });

  res.json(photo);
});

// Delete photo
router.delete("/:id", async (req, res) => {
  await Photo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;