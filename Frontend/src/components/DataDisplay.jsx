import { useState, useEffect } from "react";

function DataDisplay() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 1. Define the function that fetches data
    const fetchData = () => {
      // In the future, the real backend call will be here
      const mockData = {
        timestamp: new Date().toLocaleTimeString(), // Shows time updating
        cars_waiting: Math.floor(Math.random() * 10), // Simulates changing data
        light_status: "RED",
        message: "Live data feed active",
      };

      console.log("Fetching new data...");
      setData(mockData);
    };

    // 2. Call the function immediately on first render
    fetchData();

    // 3. Set up an interval to fetch data every 1000ms (1 second)
    const intervalId = setInterval(fetchData, 1000);

    // 4. Cleanup function: clears the interval when the component unmounts
    // This prevents memory leaks and errors when navigating away
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Backend Live Data Output:</h2>
      <pre
        style={{ background: "#f0f0f0", padding: "15px", borderRadius: "5px" }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default DataDisplay;
