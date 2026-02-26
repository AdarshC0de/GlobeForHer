require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const photoRoutes = require("./routes/photoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// serve uploads
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

app.use("/api/photos", photoRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));