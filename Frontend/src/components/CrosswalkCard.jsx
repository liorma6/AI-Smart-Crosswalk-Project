import React from "react";
import { Lightbulb, Link as LinkIcon, MapPin } from "lucide-react";
import MiniMap from "./MiniMap";

const CrosswalkCard = ({ crosswalk }) => {
  const status = crosswalk.status || "unknown";

  const statusStyles = {
    active: "bg-green-100 text-green-700",
    maintenance: "bg-amber-100 text-amber-700",
    inactive: "bg-red-100 text-red-700",
    default: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{crosswalk.name}</h3>
          {crosswalk.location && (
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
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

      <hr className="border-gray-100" />

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
      </div>
    </div>
  );
};

export default CrosswalkCard;
