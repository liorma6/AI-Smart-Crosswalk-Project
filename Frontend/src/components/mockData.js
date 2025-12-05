// Helper to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-GB");

      // Randomize stats for the chart
      const detectionValue = Math.floor(Math.random() * 60) + 20;
      const alertValue = 100 - detectionValue;

      resolve({
        // 1. Crosswalks - Now with specific Environment & Network data
        crosswalks: [
          {
            id: 1,
            name: "Allenby-Rothschild Junction",
            status: Math.random() > 0.1 ? "active" : "maintenance",
            // Specific data for this location
            environment: {
              weather: "Rainy",
              temp: 19,
            },
            network: {
              ping: "24ms",
              signal: "Good",
            },
            hardware: { camera: true, ledPanel: true, controller: true },
          },
          {
            id: 2,
            name: "Begin Road (Near Mall)",
            status: Math.random() > 0.3 ? "active" : "maintenance",
            // Specific data for this location (different from the first one)
            environment: {
              weather: "Sunny",
              temp: 24,
            },
            network: {
              ping: "120ms", // High ping example
              signal: "Weak",
            },
            hardware: {
              camera: true,
              ledPanel: Math.random() > 0.5,
              controller: true,
            },
          },
        ],

        // 2. Events Log
        recentEvents: [
          {
            id: Date.now(),
            time: timeString,
            location: getRandom(["Allenby", "Begin Road", "Kaplan"]),
            objectsCount: Math.floor(Math.random() * 5) + 1,
            distance: `${(Math.random() * 3).toFixed(1)}m`,
            type: getRandom(["Pedestrian", "Cyclist", "Dog"]),
          },
          {
            id: Date.now() - 1000,
            time: new Date(now - 5000).toLocaleTimeString("en-GB"),
            location: getRandom(["Allenby", "Begin Road"]),
            objectsCount: Math.floor(Math.random() * 3) + 1,
            distance: `${(Math.random() * 5).toFixed(1)}m`,
            type: "Pedestrian",
          },
        ],

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
