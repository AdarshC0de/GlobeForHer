require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const photoRoutes = require("./routes/photoRoutes");

const app = express();

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://your-frontend.vercel.app"
//   ]
// }));
app.use(cors());
app.use(express.json());

// serve uploads
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

app.use("/api/photos", photoRoutes);

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);

app.listen(5000, () => console.log("Server running on port 5000"));