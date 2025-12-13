import React, { useState, useEffect } from "react";
import { fetchDashboardData } from "../services/api";
import { Activity, User } from "lucide-react";
import ImageModal from "./ImageModal";
import EventsTable from "./EventsTable";
import CrosswalkCard from "./CrosswalkCard";
import StatsChart from "./StatsChart";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDashboardData();
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
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
      {/* Image Modal */}
      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

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
        {/* --- CROSSWALKS STATUS --- */}
        <section>
          <h2 className="text-lg font-bold mb-3 text-gray-700">
            System Nodes Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.crosswalks.map((cw) => (
              <CrosswalkCard key={cw.id} crosswalk={cw} />
            ))}
          </div>
        </section>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Events Table */}
          <EventsTable
            events={data.recentEvents}
            onImageClick={setSelectedImage}
          />

          {/* Stats Chart */}
          <StatsChart stats={data.stats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
