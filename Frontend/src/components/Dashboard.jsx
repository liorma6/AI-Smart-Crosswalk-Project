import React, { useState, useEffect } from "react";
import { getDashboardData } from "./mockData";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Camera,
  Lightbulb,
  Cpu,
  Activity,
  Wifi,
  CloudRain,
  Sun,
  Cloud,
  Thermometer,
  User,
} from "lucide-react";

const COLORS = ["#3b82f6", "#ef4444"];

// Helper component to render weather icon dynamically
const WeatherIcon = ({ condition }) => {
  if (condition === "Rainy")
    return <CloudRain size={16} className="text-blue-500" />;
  if (condition === "Sunny")
    return <Sun size={16} className="text-yellow-500" />;
  return <Cloud size={16} className="text-gray-400" />;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      getDashboardData()
        .then((response) => {
          setData(response);
          setLoading(false);
        })
        .catch((error) => console.error("Error:", error));
    };

    fetchData();
    // Refresh data every 3 seconds to simulate real-time updates
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading)
    return (
      <div className="text-center p-10 text-gray-500">Loading AI System...</div>
    );

  if (!data) return <div>Error loading data.</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-10">
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight">
                Smart Crosswalk AI
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <User size={12} /> {data.currentUser.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
              System Live
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* --- CROSSWALKS STATUS CARDS --- */}
        <section>
          <h2 className="text-lg font-bold mb-3 text-gray-700">
            System Nodes Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.crosswalks.map((cw) => (
              <div
                key={cw.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4"
              >
                {/* Top Row: Name and Status */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {cw.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Dynamic Network Status */}
                      <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                        <Wifi
                          size={12}
                          className={
                            cw.network.signal === "Weak"
                              ? "text-red-500"
                              : "text-green-600"
                          }
                        />
                        <span>{cw.network.ping}</span>
                      </div>
                      {/* Dynamic Weather Status */}
                      <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                        <WeatherIcon condition={cw.environment.weather} />
                        <span>{cw.environment.temp}°C</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      cw.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cw.status}
                  </span>
                </div>

                <hr className="border-gray-100" />

                {/* Bottom Row: Hardware Status */}
                <div className="flex gap-4 text-sm text-gray-500 justify-around">
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      cw.hardware.camera ? "text-blue-600" : "text-gray-300"
                    }`}
                  >
                    <Camera size={20} />{" "}
                    <span className="text-[10px] font-bold">CAM</span>
                  </div>
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      cw.hardware.ledPanel ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    <Lightbulb size={20} />{" "}
                    <span className="text-[10px] font-bold">LED</span>
                  </div>
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      cw.hardware.controller
                        ? "text-purple-600"
                        : "text-gray-300"
                    }`}
                  >
                    <Cpu size={20} />{" "}
                    <span className="text-[10px] font-bold">CPU</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- MAIN GRID (Charts + Table) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Events Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-gray-700">Real-time Events</h2>
              <span className="text-xs text-gray-400">Live Feed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Object Type</th>
                    <th className="p-3">Location</th>
                    {/* Hidden on mobile, visible on desktop */}
                    <th className="p-3 hidden md:table-cell">Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.recentEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-mono text-blue-600">
                        {event.time}
                      </td>
                      <td className="p-3 font-medium">{event.type}</td>
                      <td className="p-3 text-gray-600 truncate max-w-[100px]">
                        {event.location}
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {event.distance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats Chart */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <h2 className="font-bold text-gray-700 mb-2 w-full text-center">
              Efficiency Stats
            </h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.stats}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
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

            <div className="w-full mt-2 space-y-2">
              <div className="flex justify-between text-xs border-b border-gray-100 pb-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>{" "}
                  Passive Detection
                </span>
                <span className="font-bold">{data.stats[0].value}%</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div> Active
                  Alerts
                </span>
                <span className="font-bold">{data.stats[1].value}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
