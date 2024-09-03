const express = require("express");
const connectDB = require("./config/dbConfig");
require("colors");
require("dotenv").config();
const userRoutes = require("./routes/userRoute");
const cors = require("cors");
const morgan = require("morgan");
const doctorRoutes = require("./routes/doctorRoutes")
const adminRoutes = require("./routes/adminRoute");

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));
app.use(morgan("dev"));

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

const port = process.env.PORT || 5000;
const mode = process.env.MODE || "production";

connectDB();

app.listen(port, () => {
  console.log(
    `Server running on ${mode} mode in http://localhost:${port}`.bgMagenta.white
  );
});
