import React from "react";
import { Lightbulb, Link as LinkIcon, MapPin, Star } from "lucide-react";
import MiniMap from "./MiniMap";
import CameraStatus from "./CameraStatus";

const CrosswalkCard = ({
  crosswalk,
  isFavorite = false,
  onToggleFavorite,
  onViewDetails,
}) => {
  const status = crosswalk.status || "unknown";

  const statusStyles = {
    active: "bg-emerald-100 text-emerald-700",
    maintenance: "bg-amber-100 text-amber-700",
    inactive: "bg-red-100 text-red-700",
    default: "bg-gray-100 text-gray-700",
  };

  const handleFavoriteToggle = (event) => {
    event.stopPropagation();
    onToggleFavorite?.(crosswalk._id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(crosswalk._id);
  };

  return (
    <div
      className={`card flex flex-col gap-5 border p-5 transition ${
        onViewDetails ? "cursor-pointer hover:-translate-y-0.5" : ""
      } ${
        isFavorite
          ? "border-amber-300 shadow-lg shadow-amber-100/80"
          : "border-white"
      }`}
      onClick={handleViewDetails}
    >
      <div className="flex justify-between gap-3">
        <div className="space-y-2">
          <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-[#f97316] via-[#38bdf8] to-[#22c55e]"></div>
          <h3 className="text-lg font-semibold leading-snug text-gray-900">
            {crosswalk.name}
          </h3>
          <div className="text-xs font-mono text-[var(--muted)]">
            ID: {crosswalk._id}
          </div>
          {crosswalk.location && (
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <MapPin size={14} />
              <span>
                {crosswalk.location.lat.toFixed(4)},{" "}
                {crosswalk.location.lng.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={handleFavoriteToggle}
            className={`inline-flex items-center justify-center rounded-full border p-2 transition ${
              isFavorite
                ? "border-amber-300 bg-amber-50 text-amber-500"
                : "border-gray-200 bg-white text-gray-400 hover:border-amber-200 hover:text-amber-500"
            }`}
            aria-label={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
            title={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Star size={16} className={isFavorite ? "fill-current" : ""} />
          </button>
          <span
            className={`rounded px-2 py-1 text-xs font-bold uppercase ${
              statusStyles[status] || statusStyles.default
            }`}
          >
            {status}
          </span>
          <CameraStatus status={status} size="sm" showLabel={false} />
        </div>
      </div>

      {crosswalk.location && (
        <MiniMap
          location={crosswalk.location}
          name={crosswalk.name}
          status={status}
        />
      )}

      <div className="flex justify-between gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Lightbulb
            size={18}
            className={status === "active" ? "text-green-600" : "text-gray-400"}
          />
          <span>
            {status === "active" ? "System ready" : "Check LED controller"}
          </span>
        </div>

        {crosswalk.ledSystemUrl ? (
          <a
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            href={crosswalk.ledSystemUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            <LinkIcon size={14} />
            LED endpoint
          </a>
        ) : (
          <span className="text-xs font-medium text-[var(--muted)]">
            No LED endpoint provided
          </span>
        )}
      </div>

      {onViewDetails && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleViewDetails();
            }}
            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            View details
          </button>
        </div>
      )}
    </div>
  );
};

export default CrosswalkCard;
