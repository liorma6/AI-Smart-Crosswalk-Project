import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCrosswalks,
  fetchAlerts,
  getImageUrl,
} from "../services/api";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  AlertTriangle,
  Image as ImageIcon,
  Activity,
  Filter,
  X,
} from "lucide-react";
import ImageModal from "../components/ImageModal";
import CameraStatus from "../components/CameraStatus";
import MiniMap from "../components/MiniMap";
import { SkeletonHeader, SkeletonAlert } from "../components/SkeletonLoader";

const CrosswalkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crosswalk, setCrosswalk] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
    enabled: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [crosswalksData, alertsData] = await Promise.all([
          fetchCrosswalks(),
          fetchAlerts(),
        ]);

        const currentCrosswalk = crosswalksData.find((item) => item._id === id);

        if (!currentCrosswalk) {
          setError("Crosswalk not found");
          setLoading(false);
          return;
        }

        setCrosswalk(currentCrosswalk);

        const crosswalkAlerts = alertsData
          .filter((alert) => {
            const alertCrosswalkId =
              typeof alert.crosswalkId === "object"
                ? alert.crosswalkId?._id
                : alert.crosswalkId;

            return alertCrosswalkId?.toString() === id?.toString();
          })
          .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp));

        setAlerts(crosswalkAlerts);
        setError(null);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const filteredAlerts = useMemo(() => {
    if (!dateFilter.enabled || (!dateFilter.startDate && !dateFilter.endDate)) {
      return alerts;
    }

    return alerts.filter((alert) => {
      const alertDate = new Date(alert.timestamp);

      if (dateFilter.startDate && dateFilter.endDate) {
        const start = new Date(dateFilter.startDate);
        const end = new Date(dateFilter.endDate);
        end.setHours(23, 59, 59, 999);
        return alertDate >= start && alertDate <= end;
      }

      if (dateFilter.startDate) {
        const start = new Date(dateFilter.startDate);
        return alertDate >= start;
      }

      if (dateFilter.endDate) {
        const end = new Date(dateFilter.endDate);
        end.setHours(23, 59, 59, 999);
        return alertDate <= end;
      }

      return true;
    });
  }, [dateFilter, alerts]);

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "maintenance":
        return "Maintenance";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: "", endDate: "", enabled: false });
  };

  const applyDateFilter = () => {
    setDateFilter((current) => ({ ...current, enabled: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <SkeletonHeader />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
              <div className="h-8 w-24 animate-pulse rounded-full bg-blue-100"></div>
            </div>
            <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-6 w-40 rounded bg-gray-200"></div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="h-10 rounded-xl bg-gray-100"></div>
                <div className="h-10 rounded-xl bg-gray-100"></div>
                <div className="h-10 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200"></div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <SkeletonAlert key={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !crosswalk) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="mx-auto mb-3 text-red-600" size={48} />
          <p className="mb-4 font-semibold text-red-800">
            {error || "Crosswalk not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to list
          </button>
        </div>
      </div>
    );
  }

  const hazardCount = filteredAlerts.filter((alert) => alert.isHazard).length;
  const ledActivatedCount = filteredAlerts.filter((alert) => alert.ledActivated).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="mx-auto max-w-7xl px-3 py-3 text-white sm:px-4 sm:py-5">
          <button
            onClick={() => navigate("/")}
            className="mb-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-white/10 sm:mb-4 sm:px-3 sm:py-2 sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Back to list</span>
          </button>

          <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.5fr)_360px] xl:gap-5">
            <div className="min-w-0">
              <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 lg:flex-row">
                <div className="min-w-0 flex-1">
                  <h1 className="mb-2 truncate text-2xl font-bold sm:text-3xl lg:text-[3rem]">
                    {crosswalk.name}
                  </h1>
                  <div className="flex flex-col items-start gap-2 text-blue-100 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    <div className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 sm:w-auto sm:px-3 sm:py-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate font-mono text-xs sm:text-sm">
                        {crosswalk.location?.lat?.toFixed(6)},{" "}
                        {crosswalk.location?.lng?.toFixed(6)}
                      </span>
                    </div>
                    {crosswalk.ledSystemUrl && (
                      <div className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 sm:w-auto sm:px-3 sm:py-2">
                        <Activity className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm">
                          {crosswalk.ledSystemUrl}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex w-full flex-row items-center gap-2 sm:gap-3 lg:w-auto lg:flex-col lg:items-end">
                  <div className="flex flex-1 items-center gap-2 lg:flex-initial">
                    <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white sm:gap-2 sm:px-4 sm:py-2 sm:text-sm lg:flex-initial">
                      {getStatusText(crosswalk.status)}
                    </span>
                    <div className="rounded-full border-2 border-white/30 bg-white/10 p-1.5 sm:p-2">
                      <CameraStatus
                        status={crosswalk.status}
                        size="md"
                        showLabel={false}
                      />
                    </div>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-blue-100 sm:px-3">
                    ID: {crosswalk._id.slice(-8)}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                  <div className="mb-1 text-2xl font-bold sm:text-[2rem] leading-none">
                    {filteredAlerts.length}
                  </div>
                  <div className="text-xs text-blue-100 sm:text-sm">
                    Total alerts
                  </div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                  <div className="mb-1 text-2xl font-bold text-red-300 sm:text-[2rem] leading-none">
                    {hazardCount}
                  </div>
                  <div className="text-xs text-blue-100 sm:text-sm">
                    Hazard events
                  </div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                  <div className="mb-1 text-2xl font-bold text-green-300 sm:text-[2rem] leading-none">
                    {ledActivatedCount}
                  </div>
                  <div className="text-xs text-blue-100 sm:text-sm">
                    LED activations
                  </div>
                </div>
              </div>
            </div>

            {crosswalk.location && (
              <div className="w-full xl:-mt-4">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-2.5 shadow-lg backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold sm:text-lg">
                        Crosswalk Map
                      </h2>
                      <p className="text-xs text-blue-100">
                        Live location reference
                      </p>
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-blue-50">
                      {crosswalk.location.lat.toFixed(4)},{" "}
                      {crosswalk.location.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="[&>div]:h-[200px] [&>div]:border-white/20 [&>div]:bg-white/5 sm:[&>div]:h-[225px]">
                    <MiniMap
                      location={crosswalk.location}
                      name={crosswalk.name}
                      status={crosswalk.status}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Alert History
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:px-4 sm:py-2 sm:text-sm">
              {filteredAlerts.length} alerts
            </span>
          </div>

          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 sm:mb-5">
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <Filter className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
              </div>
              <span className="text-base font-bold text-gray-900 sm:text-lg">
                Filter by date
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
                  From date
                </label>
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(event) =>
                    setDateFilter((current) => ({
                      ...current,
                      startDate: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm transition hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:px-4 sm:text-base"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
                  To date
                </label>
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(event) =>
                    setDateFilter((current) => ({
                      ...current,
                      endDate: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm transition hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:px-4 sm:text-base"
                />
              </div>

              <div className="flex items-end gap-2 sm:col-span-2 md:col-span-1">
                <button
                  onClick={applyDateFilter}
                  disabled={!dateFilter.startDate && !dateFilter.endDate}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none sm:px-6"
                >
                  Apply filter
                </button>
                {dateFilter.enabled && (
                  <button
                    onClick={clearDateFilter}
                    className="rounded-xl border border-red-300 bg-white px-3 py-2.5 text-red-700 shadow-sm transition hover:border-red-400 hover:bg-red-50 sm:px-4"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {dateFilter.enabled &&
              (dateFilter.startDate || dateFilter.endDate) && (
                <div className="mt-3 text-sm text-gray-600">
                  Showing alerts{" "}
                  {dateFilter.startDate &&
                    `from ${new Date(dateFilter.startDate).toLocaleDateString()}`}
                  {dateFilter.startDate && dateFilter.endDate && " "}
                  {dateFilter.endDate &&
                    `until ${new Date(dateFilter.endDate).toLocaleDateString()}`}
                </div>
              )}
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <AlertTriangle className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="mb-2 text-xl font-bold text-gray-900">No alerts</h3>
            <p className="mb-4 text-gray-600">
              {dateFilter.enabled
                ? "No alerts were found in the selected date range."
                : "No alerts were recorded for this crosswalk yet."}
            </p>
            {dateFilter.enabled && (
              <button
                onClick={clearDateFilter}
                className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert._id}
                className={`overflow-hidden rounded-xl border-r-[6px] bg-white shadow-md transition-all hover:shadow-lg ${
                  alert.isHazard ? "border-red-500" : "border-yellow-500"
                }`}
              >
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-2xl">
                          {alert.isHazard ? "🚨" : "⚠️"}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900">
                          {alert.description}
                        </h3>
                      </div>

                      {alert.reasons && alert.reasons.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {alert.reasons.map((reason, index) => (
                            <span
                              key={index}
                              className="rounded border border-red-100 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {alert.detectionDistance !== null &&
                          alert.detectionDistance !== undefined && (
                            <div>
                              <span className="font-semibold">Distance:</span>{" "}
                              {alert.detectionDistance.toFixed(1)} m
                            </div>
                          )}
                        {alert.detectedObjectsCount && (
                          <div>
                            <span className="font-semibold">Objects:</span>{" "}
                            {alert.detectedObjectsCount}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {alert.ledActivated && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                          💡 LED activated
                        </span>
                      )}
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          alert.isHazard
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {alert.isHazard ? "High hazard" : "Warning"}
                      </span>
                    </div>
                  </div>

                  {alert.imageUrl ? (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setSelectedImage(alert.imageUrl)}
                          className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition hover:ring-2 hover:ring-blue-500"
                        >
                          <img
                            src={getImageUrl(alert.imageUrl)}
                            alt="Alert"
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.target.style.display = "none";
                              event.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="absolute inset-0 hidden flex-col items-center justify-center gap-2 bg-gray-200">
                            <ImageIcon className="text-gray-400" size={32} />
                            <span className="px-2 text-center text-xs text-gray-500">
                              Placeholder
                            </span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                            <span className="text-sm font-semibold text-white opacity-0 group-hover:opacity-100">
                              Click to zoom
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 text-xs text-gray-500">
                          <p className="mb-1">
                            <span className="font-semibold">Image source:</span>
                          </p>
                          <p className="break-all font-mono">{alert.imageUrl}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-lg bg-gray-100">
                          <ImageIcon size={32} />
                          <span className="mt-2 text-xs">Placeholder</span>
                        </div>
                        <span className="text-sm">No image available</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrosswalkDetails;
