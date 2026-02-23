import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { spawn } from "child_process"; // For Python AI Engine Integration
import connectDB from "./config/db.js";  // Database Connection
import crosswalkRoutes from "./routes/crosswalkRoutes.js"; // Crosswalk API Routes
import alertRoutes from "./routes/alertRoutes.js"; // Alert API Routes
import Alert from "./models/Alert.js"; // Alert Model for Database Interaction

// Config and Initialization
dotenv.config();
connectDB(); // Execute DB Connection

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set in .env

// Middleware Setup
app.use(cors()); // Enable CORS for all origins
app.use(express.json());

// This allows the browser to access the images created by the AI
app.use('/output_images', express.static('./ai_engine/output_images'));

// --- AI Engine Integration (Python Bridge) ---

// Function to initialize and monitor the Python AI service
const startAIEngine = () => {
    console.log("Start Initializing AI Engine...");

    // Start Python process - (ensures yolo_service.py is running)
    const pythonProcess = spawn("python", ["./ai_engine/yolo_service.py"]);

    // Listen for data output from the Python script (JSON format)
    pythonProcess.stdout.on("data", async (data) => {
        try {
            const rawData = data.toString(); // Convert Buffer to String
            const message = JSON.parse(rawData); // Parse JSON message from Python

            // Check if analysis is complete and a hazard is detected
            if (message.event === "ANALYSIS_COMPLETE") {
                console.log(`AI Log: File ${message.file} analyzed. Danger: ${message.is_dangerous}`);

                if (message.is_dangerous) {
                    console.log("Hazard detected! Creating alert in database...");
                    
                    // Create a new Alert document based on your Schema
                    const newAlert = new Alert({
                        // Placeholder ID - In a real scenario, this would match a specific camera/location
                        crosswalkId: "65d8c3f2e4b0a1a2b3c4d5e6", // Example ObjectId (replace with actual crosswalk reference)
                        imageUrl: `output_images/analyzed_${message.file}`,
                        description: "Automatic AI Detection: Person and Car detected simultaneously.",
                        isHazard: true,
                        ledActivated: true,
                        detectedObjectsCount: 2,
                        timestamp: new Date()
                    });

                    await newAlert.save();
                    console.log("Alert saved successfully to MongoDB.");
                }
            }
        } catch (error) {
            // Ignore non-JSON logs (like YOLO model loading text)
        }
    });

    // Handle potential errors in the Python process
    pythonProcess.stderr.on("data", (data) => {
        console.error(`AI Engine stderr: ${data}`);
    });

    // Automatically restart engine if it crashes
    pythonProcess.on("close", (code) => {
        console.log(`AI process exited with code ${code}. Restarting in 5s...`);
        setTimeout(startAIEngine, 5000);
    });
};

// Fire up the AI engine
startAIEngine();

// Routes Mounting
// Requests to /crosswalks will be handled by crosswalkRoutes
app.use("/crosswalks", crosswalkRoutes);

// Requests to /ai/alerts or /alerts will be handled by alertRoutes
// Note: In alertRoutes we used '/' so here we need to be careful with paths OR adjust the router.
// Let's use specific mounting for clarity:
app.use("/ai/alerts", alertRoutes); // For POST (AI)
app.use("/alerts", alertRoutes); // For GET (Dashboard)

// Base Route
app.get("/", (req, res) => {
  res.send("AI Smart Crosswalk Backend is Running (Refactored Structure).");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});