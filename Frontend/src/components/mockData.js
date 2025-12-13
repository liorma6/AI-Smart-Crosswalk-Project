// Helper to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Mock Crosswalk data matching the backend schema
const mockCrosswalks = [
  {
    _id: "507f1f77bcf86cd799439011",
    name: "Allenby-Rothschild Junction",
    location: {
      lat: 32.0853,
      lng: 34.7818,
    },
    status: "active",
    ledSystemUrl: "http://192.168.1.100/led",
  },
  {
    _id: "507f1f77bcf86cd799439012",
    name: "Begin Road (Near Mall)",
    location: {
      lat: 32.0873,
      lng: 34.7828,
    },
    status: "active",
    ledSystemUrl: "http://192.168.1.101/led",
  },
];

// Mock Alert data matching the backend schema
const generateMockAlerts = () => {
  const now = new Date();
  const alerts = [];

  for (let i = 0; i < 5; i++) {
    const crosswalk = getRandom(mockCrosswalks);
    const hasDistance = Math.random() > 0.2; // 80% have distance, 20% don't
    const objectCount = Math.floor(Math.random() * 5) + 1;

    alerts.push({
      _id: `alert_${Date.now()}_${i}`,
      crosswalkId: crosswalk._id,
      imageUrl: `/images/alert_${i + 1}.jpg`,
      description: getRandom([
        "Pedestrian detected approaching crosswalk",
        "Cyclist detected near intersection",
        "Multiple pedestrians waiting to cross",
        "Dog detected on crosswalk",
        "Hazard: Fast-moving vehicle detected",
      ]),
      // detectionDistance is optional - sometimes null/undefined
      detectionDistance: hasDistance ? parseFloat((Math.random() * 5 + 1).toFixed(1)) : undefined,
      // detectedObjectsCount defaults to 1 if not provided
      detectedObjectsCount: objectCount,
      ledActivated: Math.random() > 0.3,
      isHazard: Math.random() > 0.6,
      timestamp: new Date(now - i * 5000),
    });
  }

  return alerts.sort((a, b) => b.timestamp - a.timestamp);
};

export const getDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alerts = generateMockAlerts();

      // Calculate stats from alerts
      const totalAlerts = alerts.length;
      const ledActivatedCount = alerts.filter((a) => a.ledActivated).length;
      const passiveCount = totalAlerts - ledActivatedCount;

      const detectionValue =
        Math.floor((passiveCount / totalAlerts) * 100) || 70;
      const alertValue = 100 - detectionValue;

      resolve({
        // 1. Crosswalks - Matching backend Crosswalk schema
        crosswalks: mockCrosswalks.map((cw) => ({
          ...cw,
          // Add frontend-specific display data
          environment: {
            weather: getRandom(["Rainy", "Sunny", "Cloudy"]),
            temp: Math.floor(Math.random() * 15) + 15,
          },
          network: {
            ping: `${Math.floor(Math.random() * 100) + 20}ms`,
            signal: Math.random() > 0.5 ? "Good" : "Weak",
          },
          hardware: {
            camera: true,
            ledPanel: Math.random() > 0.1,
            controller: true,
          },
        })),

        // 2. Alerts - Matching backend Alert schema
        recentEvents: alerts.map((alert) => {
          const crosswalk = mockCrosswalks.find(
            (cw) => cw._id === alert.crosswalkId
          );
          return {
            id: alert._id,
            time: alert.timestamp.toLocaleTimeString("en-GB"),
            location: crosswalk?.name || "Unknown",
            objectsCount: alert.detectedObjectsCount || 1, // Default to 1 as per schema
            distance: alert.detectionDistance ? `${alert.detectionDistance}m` : null, // Can be null/undefined
            type: alert.description.includes("Pedestrian")
              ? "Pedestrian"
              : alert.description.includes("Cyclist")
              ? "Cyclist"
              : alert.description.includes("Dog")
              ? "Dog"
              : "Unknown",
            ledActivated: alert.ledActivated,
            isHazard: alert.isHazard,
            imageUrl: alert.imageUrl,
            description: alert.description,
          };
        }),

        // 3. System Stats
        stats: [
          { name: "Detection Only", value: detectionValue },
          { name: "True Alert (LEDs)", value: alertValue },
        ],

        currentUser: { name: "Israel Israeli", role: "Admin" },
      });
    }, 500);
  });
};
