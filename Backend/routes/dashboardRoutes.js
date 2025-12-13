import express from 'express';
import Crosswalk from '../models/Crosswalk.js';
import Alert from '../models/Alert.js';

const router = express.Router();

// GET /api/dashboard - Get all dashboard data
router.get('/', async (req, res) => {
  try {
    // Fetch all crosswalks
    const crosswalks = await Crosswalk.find();

    // Fetch recent alerts (last 10)
    const recentAlerts = await Alert.find()
      .populate('crosswalkId')
      .sort({ timestamp: -1 })
      .limit(10);

    // Calculate stats
    const totalAlerts = await Alert.countDocuments();
    const ledActivatedCount = await Alert.countDocuments({ ledActivated: true });
    const passiveCount = totalAlerts - ledActivatedCount;

    const detectionValue = totalAlerts > 0
      ? Math.floor((passiveCount / totalAlerts) * 100)
      : 70;
    const alertValue = 100 - detectionValue;

    // Format response to match Frontend expectations
    const response = {
      crosswalks: crosswalks.map(cw => ({
        _id: cw._id,
        name: cw.name,
        location: cw.location,
        status: cw.status,
        ledSystemUrl: cw.ledSystemUrl,
        // Add mock data for frontend display (these don't exist in DB)
        environment: {
          weather: getRandomWeather(),
          temp: Math.floor(Math.random() * 15) + 15
        },
        network: {
          ping: `${Math.floor(Math.random() * 100) + 20}ms`,
          signal: Math.random() > 0.5 ? "Good" : "Weak"
        },
        hardware: {
          camera: true,
          ledPanel: true,
          controller: true
        }
      })),
      recentEvents: recentAlerts.map(alert => ({
        id: alert._id,
        time: new Date(alert.timestamp).toLocaleTimeString("en-GB"),
        location: alert.crosswalkId?.name || "Unknown",
        objectsCount: alert.detectedObjectsCount || 1,
        distance: alert.detectionDistance ? `${alert.detectionDistance}m` : null,
        type: extractType(alert.description),
        ledActivated: alert.ledActivated,
        isHazard: alert.isHazard,
        imageUrl: alert.imageUrl,
        description: alert.description
      })),
      stats: [
        { name: "Detection Only", value: detectionValue },
        { name: "True Alert (LEDs)", value: alertValue }
      ],
      currentUser: {
        name: "Israel Israeli",
        role: "Admin"
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[Dashboard Error]:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function getRandomWeather() {
  const options = ["Rainy", "Sunny", "Cloudy"];
  return options[Math.floor(Math.random() * options.length)];
}

function extractType(description) {
  if (!description) return "Unknown";
  if (description.includes("Pedestrian") || description.includes("pedestrian")) return "Pedestrian";
  if (description.includes("Cyclist") || description.includes("Bicycle") || description.includes("bicycle")) return "Cyclist";
  if (description.includes("Dog") || description.includes("dog") || description.includes("Animal")) return "Dog";
  return "Unknown";
}

export default router;
