import { useState, useEffect } from "react";

function DataDisplay() {
  // 1. State to store the data we receive (initially null)
  const [data, setData] = useState(null);

  // 2. useEffect runs once when the component mounts
  useEffect(() => {
    // --- Mock Data Section ---
    // This object simulates the response we expect from the backend.
    // TODO: Replace this object with a real fetch() call when endpoints are ready.
    const mockData = {
      message: "This is temporary mock data",
      status: "success",
      users: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
      system_check: "All systems operational",
    };

    // Update the state with the mock data
    setData(mockData);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Backend Data Output</h2>
      <p>Raw JSON view for development:</p>

      {/* 3. Display the raw data using JSON.stringify for easy debugging */}
      <div
        style={{
          background: "#f4f4f4",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

export default DataDisplay;
