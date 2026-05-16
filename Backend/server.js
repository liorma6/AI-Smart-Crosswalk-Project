import express from "express"; // Web framework for Node.js
import dotenv from "dotenv"; // For loading environment variables from .env file
import cors from "cors"; // Middleware to enable CORS (Cross-Origin Resource Sharing)
import connectDB from "./config/db.js"; // Database Connection
import { isDatabaseReady } from "./config/db.js";
import crosswalkRoutes from "./routes/crosswalkRoutes.js"; // Crosswalk API Routes
import alertRoutes from "./routes/alertRoutes.js"; // Alert API Routes
import Alert from "./models/Alert.js"; // Alert Model for Database Interaction
import path from "path"; // For handling file paths in a way that works across different operating systems
import { fileURLToPath } from "url"; // To get __dirname in ES modules
import { createServer } from "http"; // Required for Socket.io to wrap express
import { Server } from "socket.io"; // Real-time engine

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Load environment variables from .env file
await connectDB(); // Execute DB Connection

const app = express();
const allowedOrigin = "https://ai-smart-crosswalk-project.vercel.app";
const httpServer = createServer(app); // Create an HTTP server from the express app
const io = new Server(httpServer, {
  cors: { origin: allowedOrigin }, // Enable CORS for Socket.io
});

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set in .env
const DEFAULT_CROSSWALK_ID = "699f27d6b6cae8b2c7d16400";

// Middleware Setup
app.use(cors({ origin: allowedOrigin })); // Enable CORS for the Vercel frontend
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// This allows the browser to access the images created by the AI
const imagesPath = path.resolve(__dirname, "ai_engine", "output_images");
app.use("/output_images", express.static(imagesPath)); // Serve the output_images folder as static files at the /output_images route. For backup. we will use Cloudinary URLs in production, but this allows local access during development and testing.

// Log the path to terminal for verification
console.log(`[Server] Serving static files from: ${imagesPath}`);

// --- Socket.io Connection Monitoring ---
io.on("connection", (socket) => {
  console.log(`[Socket] A client connected: ${socket.id}`);
  socket.on("disconnect", () => console.log("[Socket] Client disconnected"));
});

const buildAlertPayload = (body = {}) => {
  const detectionDistance =
    body.detectionDistance ?? body.detection_distance ?? 0;
  const detectedObjectsCount =
    body.detectedObjectsCount ?? body.person_count ?? body.objects_count ?? 0;

  return {
    crosswalkId: body.crosswalkId || body.crosswalk_id || DEFAULT_CROSSWALK_ID,
    imageUrl: body.imageUrl || body.image_url || null,
    description:
      body.description || "Automatic AI Detection: Danger detected.",
    reasons: Array.isArray(body.reasons) ? body.reasons : [],
    detectionDistance,
    isHazard: body.isHazard ?? body.is_hazard ?? true,
    ledActivated: body.ledActivated ?? body.led_activated ?? true,
    detectedObjectsCount,
    timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
  };
};

const saveAlertAndEmit = async (alertPayload) => {
  if (!isDatabaseReady()) {
    const error = new Error(
      "MongoDB is not connected. External alert was not saved.",
    );
    error.statusCode = 503;
    throw error;
  }

  const newAlert = new Alert(alertPayload);
  const savedAlert = await newAlert.save();

  const populatedAlert = await Alert.findById(savedAlert._id).populate(
    "crosswalkId",
  );
  console.log("[Alerts] Alert saved successfully to MongoDB.");

  io.emit("new_alert", populatedAlert);
  console.log("[Socket] Alert event emitted with populated data.");

  return populatedAlert;
};

app.post("/api/alerts", async (req, res) => {
  try {
    const alertPayload = buildAlertPayload(req.body);
    const populatedAlert = await saveAlertAndEmit(alertPayload);

    res.status(201).json(populatedAlert);
  } catch (error) {
    console.error("[Alerts] Failed to accept external AI alert:", error);
    res.status(error.statusCode || 400).json({ error: error.message });
  }
});

// Routes Mounting
app.use("/crosswalks", crosswalkRoutes);
app.use("/ai/alerts", alertRoutes); // For POST (AI)
app.use("/alerts", alertRoutes); // For GET (Dashboard)

// Base Route
app.get("/", (req, res) => {
  res.send(
    "AI Smart Crosswalk Backend is Running with Socket.io external alert ingestion.",
  );
});

/**
 * Render Keep-Alive Endpoint
 * Prevents the free tier from sleeping by responding to UptimeRobot pings.
 */
app.get('/keep-alive', (req, res) => {
  // AI-Smart-Crosswalk-Project
  console.log("Project: AI-Smart-Crosswalk is awake!");
  res.status(200).send('I am alive');
});

// Start Server using httpServer to support WebSockets
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    "[Server] Local Python AI worker is disabled. Awaiting external alerts at POST /api/alerts.",
  );
});
