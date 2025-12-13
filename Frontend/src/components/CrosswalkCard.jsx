import React from "react";
import { Lightbulb, Link as LinkIcon, MapPin } from "lucide-react";
import MiniMap from "./MiniMap";

const CrosswalkCard = ({ crosswalk }) => {
  const status = crosswalk.status || "unknown";

  const statusStyles = {
    active: "bg-emerald-100 text-emerald-700",
    maintenance: "bg-amber-100 text-amber-700",
    inactive: "bg-red-100 text-red-700",
    default: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="card p-5 flex flex-col gap-5">
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-2">
          <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-[#f97316] via-[#38bdf8] to-[#22c55e]"></div>
          <h3 className="font-semibold text-lg text-gray-900 leading-snug">
            {crosswalk.name}
          </h3>
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

        <span
          className={`px-2 py-1 rounded text-xs font-bold uppercase ${statusStyles[status] || statusStyles.default}`}
        >
          {status}
        </span>
      </div>

      {crosswalk.location && (
        <MiniMap
          location={crosswalk.location}
          name={crosswalk.name}
          status={status}
        />
      )}

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Lightbulb
            size={18}
            className={status === "active" ? "text-green-600" : "text-gray-400"}
          />
          <span>
            {status === "active" ? "System ready" : "Check LED controller"}
          </span>
        </div>

        {crosswalk.ledSystemUrl && (
          <a
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
            href={crosswalk.ledSystemUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon size={14} />
            LED endpoint
          </a>
        )}
        {!crosswalk.ledSystemUrl && (
          <span className="text-xs text-[var(--muted)] font-medium">
            No LED endpoint provided
          </span>
        )}
      </div>
    </div>
  );
};

export default CrosswalkCard;
