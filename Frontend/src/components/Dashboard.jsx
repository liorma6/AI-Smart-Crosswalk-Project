import React, { useState, useEffect } from "react";
import { getDashboardData } from "./mockData";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Camera, Lightbulb, Cpu, Activity } from "lucide-react";

const COLORS = ["#3b82f6", "#ef4444"];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Define the fetch function
    const fetchData = () => {
      getDashboardData()
        .then((response) => {
          setData(response);
          setLoading(false);
        })
        .catch((error) => console.error("Error:", error));
    };

    // 2. Call it immediately on mount
    fetchData();

    // 3. Set up a timer to call it every 3 seconds
    const intervalId = setInterval(fetchData, 3000);

    // 4. Cleanup function (stops the timer when you leave the page)
    return () => clearInterval(intervalId);
  }, []);

  if (loading)
    return (
      <div className="text-center p-10 font-sans text-gray-500">
        Initializing System...
      </div>
    );

  if (!data) return <div>Error loading data.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            AI Smart Crosswalk Dashboard
          </h1>
          <p className="text-gray-500">
            Hello, {data.currentUser.name} ({data.currentUser.role})
          </p>
        </div>
        <div className="bg-white p-2 rounded shadow text-sm border-t-2 border-green-500 flex items-center gap-2">
          System Status:{" "}
          <span className="text-green-600 font-bold">Live Monitoring</span>
          {/* עיגול ירוק מהבהב כדי להראות שזה חי */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
      </header>

      {/* Crosswalk Status Cards */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
        <Activity size={20} /> Crosswalk Status (Real-time)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {data.crosswalks.map((cw) => (
          <div
            key={cw.id}
            className="bg-white p-4 rounded-lg shadow border-r-4 border-blue-500 transition-all duration-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{cw.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium transition-colors duration-300 ${
                    cw.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {cw.status === "active" ? "Active" : "Alert / Maintenance"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-4 text-sm text-gray-600">
              <div
                className={`flex items-center gap-1 ${
                  cw.hardware.camera ? "text-green-600" : "text-red-500"
                }`}
              >
                <Camera size={16} /> Camera
              </div>
              <div
                className={`flex items-center gap-1 ${
                  cw.hardware.ledPanel ? "text-green-600" : "text-red-500"
                }`}
              >
                <Lightbulb size={16} /> LED
              </div>
              <div
                className={`flex items-center gap-1 ${
                  cw.hardware.controller ? "text-green-600" : "text-red-500"
                }`}
              >
                <Cpu size={16} /> Controller
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events Log - Updates dynamically */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Live Events Feed
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                  <th className="p-3">Time</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Detected Objects</th>
                  <th className="p-3">Distance</th>
                </tr>
              </thead>
              <tbody>
                {data.recentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-gray-100 animate-pulse-once"
                  >
                    <td className="p-3 font-mono text-blue-600">
                      {event.time}
                    </td>
                    <td className="p-3 text-gray-700">{event.location}</td>
                    <td className="p-3 font-bold text-gray-800">
                      {event.objectsCount}
                    </td>
                    <td className="p-3 text-gray-500">{event.distance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart - Updates dynamically */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-gray-700 w-full text-right">
            Detection vs. Alerts
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.stats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                  animationDuration={500} // Smooth animation
                >
                  {data.stats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 w-full">
            <div className="flex justify-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>{" "}
                Detection
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div> Alert
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
