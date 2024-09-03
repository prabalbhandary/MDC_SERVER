const express = require("express");
const connectDB = require("./config/dbConfig");
require("colors");
require("dotenv").config();
const userRoutes = require("./routes/userRoute");
const cors = require("cors");
const morgan = require("morgan");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoute");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

const app = express();

// Middleware for security
app.use(helmet());

// Middleware for compression
app.use(compression());

// Middleware for rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json());

// CORS settings for production
app.use(cors({ origin: process.env.CORS_ORIGIN, methods: "GET, POST" }));

// Use morgan for logging in production
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined")); // Use the 'combined' format for production
} else {
  app.use(morgan("dev")); // Use 'dev' format for development
}

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to the database and start server
const port = process.env.PORT || 5000;
const mode = process.env.NODE_ENV || "production";

connectDB();

app.listen(port, () => {
  console.log(
    `Server running on ${mode} mode at http://localhost:${port}`.bgMagenta.white
  );
});
