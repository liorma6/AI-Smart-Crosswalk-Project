// Helper to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate current time string
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-GB"); // HH:MM:SS format

      // Randomize stats
      const detectionValue = Math.floor(Math.random() * 60) + 20; // 20-80
      const alertValue = 100 - detectionValue;

      resolve({
        // 1. Crosswalks with semi-random status
        crosswalks: [
          {
            id: 1,
            name: "Allenby-Rothschild Junction",
            status: Math.random() > 0.1 ? "active" : "maintenance", // 90% chance active
            hardware: { camera: true, ledPanel: true, controller: true },
          },
          {
            id: 2,
            name: "Begin Road (Near Mall)",
            status: Math.random() > 0.3 ? "active" : "maintenance",
            hardware: {
              camera: true,
              ledPanel: Math.random() > 0.5,
              controller: true,
            },
          },
        ],

        // 2. Events that look "fresh" with current time
        recentEvents: [
          {
            id: Date.now(), // Unique ID based on timestamp
            time: timeString,
            location: getRandom([
              "Allenby-Rothschild",
              "Begin Road",
              "Kaplan St",
            ]),
            objectsCount: Math.floor(Math.random() * 5) + 1, // 1-5 objects
            distance: `${(Math.random() * 3).toFixed(1)}m`,
          },
          {
            id: Date.now() - 1000,
            time: new Date(now - 5000).toLocaleTimeString("en-GB"), // 5 seconds ago
            location: getRandom(["Allenby-Rothschild", "Begin Road"]),
            objectsCount: Math.floor(Math.random() * 3) + 1,
            distance: `${(Math.random() * 5).toFixed(1)}m`,
          },
        ],

        // 3. Stats that move
        stats: [
          { name: "Detection Only", value: detectionValue },
          { name: "True Alert (LEDs)", value: alertValue },
        ],

        currentUser: { name: "Israel Israeli", role: "System Admin" },
      });
    }, 500); // 500ms network delay
  });
};
