import React, { useEffect, useMemo, useState } from "react";
import { fetchAlerts, fetchCrosswalks } from "../services/api";
import { Activity } from "lucide-react";
import ImageModal from "./ImageModal";
import EventsTable from "./EventsTable";
import CrosswalkCard from "./CrosswalkCard";
import StatsChart from "./StatsChart";
import { SkeletonCard, SkeletonTable, SkeletonChart } from "./SkeletonLoader";

const Dashboard = () => {
  const [crosswalks, setCrosswalks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState([
    { name: "Detection Only", value: 0 },
    { name: "True Alert (LEDs)", value: 0 },
  ]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const crosswalkNameMap = useMemo(() => {
    return new Map(crosswalks.map((cw) => [cw._id, cw.name]));
  }, [crosswalks]);

  const formattedEvents = useMemo(() => {
    return alerts
      .map((alert) => {
        const crosswalkName =
          typeof alert.crosswalkId === "object" && alert.crosswalkId !== null
            ? alert.crosswalkId.name
            : crosswalkNameMap.get(alert.crosswalkId) || "Unknown Crosswalk";

        const timestamp = alert.timestamp ? new Date(alert.timestamp) : null;

        return {
          id: alert._id,
          timestampValue: timestamp ? timestamp.getTime() : 0,
          time: timestamp
            ? timestamp.toLocaleTimeString("he-IL", { hour12: false })
            : "--:--",
          type: alert.description || "Alert",
          objectsCount: alert.detectedObjectsCount ?? 1,
          distance:
            alert.detectionDistance !== undefined &&
            alert.detectionDistance !== null
              ? `${alert.detectionDistance}m`
              : null,
          location: crosswalkName,
          ledActivated: alert.ledActivated,
          isHazard: alert.isHazard,
          imageUrl: alert.imageUrl,
          description: alert.description,
        };
      })
      .sort((a, b) => b.timestampValue - a.timestampValue);
  }, [alerts, crosswalkNameMap]);

  const calculateStats = (alertList) => {
    const total = alertList.length;
    const activeAlerts = alertList.filter((a) => a.ledActivated).length;
    const passiveAlerts = total - activeAlerts;

    const activePct = total ? Math.round((activeAlerts / total) * 100) : 0;
    const passivePct = total ? Math.round((passiveAlerts / total) * 100) : 0;

    return [
      { name: "Detection Only", value: passivePct },
      { name: "True Alert (LEDs)", value: activePct },
    ];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crosswalkResponse, alertsResponse] = await Promise.all([
          fetchCrosswalks(),
          fetchAlerts(),
        ]);

        setCrosswalks(crosswalkResponse || []);
        setAlerts(alertsResponse || []);
        setStats(calculateStats(alertsResponse || []));
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Error loading data from server.");
      }

      setLoading(false);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)] pb-10">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-10 bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] shadow-md">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5 md:py-6 flex flex-col md:flex-row justify-between items-start gap-3 sm:gap-4 text-white">
            <div className="flex items-center gap-2 sm:gap-3 animate-pulse">
              <div className="bg-white/10 border border-white/10 p-1.5 sm:p-2 rounded-lg">
                <Activity size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/20 rounded w-24"></div>
                <div className="h-8 bg-white/30 rounded w-48"></div>
                <div className="h-4 bg-white/20 rounded w-64"></div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 animate-pulse">
              <div className="h-8 bg-white/20 rounded-full w-32"></div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
          {/* Crosswalks Skeleton */}
          <section className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-pulse">
              <div>
                <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </section>

          {/* Main Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <SkeletonTable />
            </div>
            <div>
              <SkeletonChart />
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <footer className="mt-6 sm:mt-10 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto border-t border-gray-200 pt-3 sm:pt-4 pb-4 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        </footer>
      </div>
    );
  }

  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)] pb-10">
      {/* Image Modal */}
      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5 md:py-6 flex flex-col md:flex-row justify-between items-start gap-3 sm:gap-4 text-white">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white/10 border border-white/10 p-1.5 sm:p-2 rounded-lg">
              <Activity size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.22em] text-white/60 font-semibold">
                Live Dashboard
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">
                Smart Crosswalk AI
              </h1>
              <p className="text-xs sm:text-sm text-white/70">
                Monitoring {crosswalks.length} crosswalks · {alerts.length} alerts logged
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 border border-white/20 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.12em]">
              System Live
              <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-400"></span>
              </span>
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {/* --- CROSSWALKS STATUS --- */}
        <section className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] font-semibold">
                Network Health
              </p>
              <h2 className="text-lg sm:text-xl font-semibold mt-1">System Nodes</h2>
            </div>
            <span className="badge badge-neutral text-xs sm:text-sm">
              {crosswalks.length} active nodes
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {crosswalks.map((cw) => (
              <CrosswalkCard key={cw._id} crosswalk={cw} />
            ))}
            {crosswalks.length === 0 && (
              <div className="col-span-2 text-sm text-[var(--muted)] ghost rounded-xl p-4 text-center">
                No crosswalks found. Create crosswalks via the backend to see them here.
              </div>
            )}
          </div>
        </section>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Events Table */}
          <EventsTable events={formattedEvents} onImageClick={setSelectedImage} />

          {/* Stats Chart */}
          <StatsChart stats={stats} />
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="mt-6 sm:mt-10 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto border-t border-gray-200 pt-3 sm:pt-4 pb-4 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--muted)]">
          <span>Smart Crosswalk AI · Live monitoring</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Last refresh every 5s
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
