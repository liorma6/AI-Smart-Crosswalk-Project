import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Camera,
  TrendingUp,
} from "lucide-react";
import { SkeletonChart, SkeletonStats } from "../components/SkeletonLoader";
import { fetchAlerts, fetchCrosswalks } from "../services/api";

const FILTER_RANGES = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  all: Infinity,
};

const PIE_COLORS = ["#2563eb", "#dc2626", "#f59e0b", "#10b981"];

const Statistics = () => {
  const [crosswalks, setCrosswalks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("week");
  const [selectedCrosswalk, setSelectedCrosswalk] = useState("all");
  const [alertFilter, setAlertFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [crosswalksData, alertsData] = await Promise.all([
          fetchCrosswalks(),
          fetchAlerts(),
        ]);
        setCrosswalks(crosswalksData || []);
        setAlerts(alertsData || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAlerts = useMemo(() => {
    const now = Date.now();

    return alerts.filter((alert) => {
      const timestamp = new Date(alert.timestamp).getTime();
      const crosswalkId =
        typeof alert.crosswalkId === "object"
          ? alert.crosswalkId?._id
          : alert.crosswalkId;

      const matchesRange =
        timeRange === "all"
          ? true
          : Number.isFinite(timestamp) && now - timestamp <= FILTER_RANGES[timeRange];

      const matchesCrosswalk =
        selectedCrosswalk === "all" || crosswalkId === selectedCrosswalk;

      const matchesAlertType =
        alertFilter === "all"
          ? true
          : alertFilter === "hazard"
            ? Boolean(alert.isHazard)
            : alertFilter === "led"
              ? Boolean(alert.ledActivated)
              : !alert.ledActivated;

      return matchesRange && matchesCrosswalk && matchesAlertType;
    });
  }, [alerts, timeRange, selectedCrosswalk, alertFilter]);

  const scopedCrosswalks = useMemo(() => {
    if (selectedCrosswalk === "all") {
      return crosswalks;
    }

    return crosswalks.filter((crosswalk) => crosswalk._id === selectedCrosswalk);
  }, [crosswalks, selectedCrosswalk]);

  const statusData = useMemo(
    () => [
      {
        name: "Active",
        value: scopedCrosswalks.filter((crosswalk) => crosswalk.status === "active")
          .length,
        color: "#10b981",
      },
      {
        name: "Maintenance",
        value: scopedCrosswalks.filter(
          (crosswalk) => crosswalk.status === "maintenance",
        ).length,
        color: "#f59e0b",
      },
      {
        name: "Inactive",
        value: scopedCrosswalks.filter((crosswalk) => crosswalk.status === "inactive")
          .length,
        color: "#ef4444",
      },
    ].filter((entry) => entry.value > 0),
    [scopedCrosswalks],
  );

  const hazardData = useMemo(
    () => [
      {
        name: "Hazard",
        value: filteredAlerts.filter((alert) => alert.isHazard).length,
        color: "#dc2626",
      },
      {
        name: "Warning",
        value: filteredAlerts.filter((alert) => !alert.isHazard).length,
        color: "#f59e0b",
      },
    ].filter((entry) => entry.value > 0),
    [filteredAlerts],
  );

  const ledActivationData = useMemo(
    () => [
      {
        name: "LED activated",
        value: filteredAlerts.filter((alert) => alert.ledActivated).length,
        color: "#3b82f6",
      },
      {
        name: "Detection only",
        value: filteredAlerts.filter((alert) => !alert.ledActivated).length,
        color: "#64748b",
      },
    ].filter((entry) => entry.value > 0),
    [filteredAlerts],
  );

  const alertsByCrosswalk = useMemo(
    () =>
      scopedCrosswalks
        .map((crosswalk) => {
          const crosswalkAlerts = filteredAlerts.filter((alert) => {
            const alertCrosswalkId =
              typeof alert.crosswalkId === "object"
                ? alert.crosswalkId?._id
                : alert.crosswalkId;
            return alertCrosswalkId === crosswalk._id;
          });

          return {
            name: crosswalk.name.split(",")[1]?.trim() || crosswalk.name,
            alerts: crosswalkAlerts.length,
            hazards: crosswalkAlerts.filter((alert) => alert.isHazard).length,
          };
        })
        .sort((left, right) => right.alerts - left.alerts),
    [filteredAlerts, scopedCrosswalks],
  );

  const alertsTimeline = useMemo(() => {
    const labelOptions =
      timeRange === "day"
        ? { hour: "2-digit" }
        : { day: "numeric", month: "short" };

    return [...filteredAlerts]
      .sort(
        (left, right) =>
          new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
      )
      .reduce((accumulator, alert) => {
        const timestamp = new Date(alert.timestamp);
        const label = timestamp.toLocaleDateString("en-US", labelOptions);
        const existing = accumulator.find((item) => item.label === label);

        if (existing) {
          existing.alerts += 1;
          if (alert.isHazard) {
            existing.hazards += 1;
          }
        } else {
          accumulator.push({
            label,
            alerts: 1,
            hazards: alert.isHazard ? 1 : 0,
          });
        }

        return accumulator;
      }, []);
  }, [filteredAlerts, timeRange]);

  const averageDistance = useMemo(() => {
    if (filteredAlerts.length === 0) {
      return "0.00";
    }

    return (
      filteredAlerts.reduce(
        (sum, alert) => sum + Number(alert.detectionDistance || 0),
        0,
      ) / filteredAlerts.length
    ).toFixed(2);
  }, [filteredAlerts]);

  const averageObjects = useMemo(() => {
    if (filteredAlerts.length === 0) {
      return "0.0";
    }

    return (
      filteredAlerts.reduce(
        (sum, alert) => sum + Number(alert.detectedObjectsCount || 0),
        0,
      ) / filteredAlerts.length
    ).toFixed(1);
  }, [filteredAlerts]);

  const ledActivationRate = filteredAlerts.length
    ? ((filteredAlerts.filter((alert) => alert.ledActivated).length / filteredAlerts.length) * 100).toFixed(0)
    : 0;

  const hazardRate = filteredAlerts.length
    ? ((filteredAlerts.filter((alert) => alert.isHazard).length / filteredAlerts.length) * 100).toFixed(0)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-2 h-8 w-48 rounded bg-gray-200"></div>
                <div className="h-4 w-40 rounded bg-gray-200"></div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-10 w-20 rounded-lg bg-gray-100"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <SkeletonStats key={item} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <SkeletonChart key={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 text-rose-600" size={40} />
          <h1 className="text-xl font-semibold text-slate-900">
            Statistics are unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const timeButtons = [
    { id: "day", label: "24h" },
    { id: "week", label: "7d" },
    { id: "month", label: "30d" },
    { id: "all", label: "All" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                Statistics
              </span>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Filtered system analytics
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-600">
                  The charts below now respond to the selected time range,
                  crossing, and alert mode filters.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 xl:justify-end">
              {timeButtons.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => setTimeRange(button.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    timeRange === button.id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_360px]">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Crossing</span>
              <select
                value={selectedCrosswalk}
                onChange={(event) => setSelectedCrosswalk(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
              >
                <option value="all">All crossings</option>
                {crosswalks.map((crosswalk) => (
                  <option key={crosswalk._id} value={crosswalk._id}>
                    {crosswalk.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Alert type</span>
              <select
                value={alertFilter}
                onChange={(event) => setAlertFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
              >
                <option value="all">All events</option>
                <option value="hazard">Hazards only</option>
                <option value="led">LED activated</option>
                <option value="detection">Detection only</option>
              </select>
            </label>

            <div className="rounded-2xl bg-slate-50 p-4 lg:self-end">
              <p className="text-sm font-medium text-slate-700">Active filters</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {timeButtons.find((button) => button.id === timeRange)?.label} window,
                {" "}
                {selectedCrosswalk === "all"
                  ? "all crossings"
                  : crosswalks.find((crosswalk) => crosswalk._id === selectedCrosswalk)
                      ?.name || "selected crossing"}
                , {alertFilter === "all" ? "all events" : alertFilter}.
              </p>
            </div>
          </div>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Activity size={32} />
              <TrendingUp size={24} className="opacity-75" />
            </div>
            <div className="mb-2 text-4xl font-bold">{filteredAlerts.length}</div>
            <div className="text-sm text-blue-100">Filtered alerts</div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-red-500 to-red-600 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <AlertTriangle size={32} />
              <TrendingUp size={24} className="opacity-75" />
            </div>
            <div className="mb-2 text-4xl font-bold">
              {filteredAlerts.filter((alert) => alert.isHazard).length}
            </div>
            <div className="text-sm text-red-100">Hazard events</div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Camera size={32} />
              <Activity size={24} className="opacity-75" />
            </div>
            <div className="mb-2 text-4xl font-bold">{scopedCrosswalks.length}</div>
            <div className="text-sm text-green-100">Crossings in scope</div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Calendar size={32} />
              <TrendingUp size={24} className="opacity-75" />
            </div>
            <div className="mb-2 text-4xl font-bold">{averageDistance}m</div>
            <div className="text-sm text-purple-100">Average distance</div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Crossing status distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Hazard vs. warning mix
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={hazardData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {hazardData.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              LED activation breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ledActivationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {ledActivationData.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Filter summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                <span className="font-medium text-gray-700">Average objects per event</span>
                <span className="text-2xl font-bold text-blue-600">
                  {averageObjects}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                <span className="font-medium text-gray-700">LED activation rate</span>
                <span className="text-2xl font-bold text-green-600">
                  {ledActivationRate}%
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
                <span className="font-medium text-gray-700">Hazard rate</span>
                <span className="text-2xl font-bold text-red-600">
                  {hazardRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Alerts by crossing
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={alertsByCrosswalk}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" height={90} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="alerts" fill="#3b82f6" />
                <Bar dataKey="hazards" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Alert trend over time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={alertsTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="alerts" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="hazards" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
