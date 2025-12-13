import React from "react";
import { Camera, Lightbulb } from "lucide-react";
import { getImageUrl } from "../services/api";

const EventsTable = ({ events, onImageClick }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-bold text-gray-700">Real-time Events</h2>
        <span className="text-xs text-gray-400">Live Feed</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Time</th>
              <th className="p-3">Type</th>
              <th className="p-3">Count</th>
              <th className="p-3">Location</th>
              <th className="p-3 hidden md:table-cell">Distance</th>
              <th className="p-3 hidden lg:table-cell">LED</th>
              <th className="p-3 hidden lg:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr
                key={event.id}
                className={`hover:bg-gray-50 transition-colors ${
                  event.isHazard ? "bg-red-50" : ""
                }`}
                title={event.description || "No description available"}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {event.imageUrl ? (
                      <Camera
                        size={20}
                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                        title="Click to view image"
                        onClick={() => onImageClick(getImageUrl(event.imageUrl))}
                      />
                    ) : (
                      <Camera size={20} className="text-gray-300" />
                    )}
                  </div>
                </td>
                <td className="p-3 font-mono text-blue-600">{event.time}</td>
                <td className="p-3 font-medium">{event.type}</td>
                <td className="p-3 font-bold text-gray-800">
                  {event.objectsCount || 1}
                </td>
                <td className="p-3 text-gray-600 truncate max-w-[100px]">
                  {event.location}
                </td>
                <td className="p-3 hidden md:table-cell">
                  <span
                    className={event.distance ? "" : "text-gray-400 italic"}
                  >
                    {event.distance || "N/A"}
                  </span>
                </td>
                <td className="p-3 hidden lg:table-cell">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      event.ledActivated
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Lightbulb size={12} />
                    {event.ledActivated ? "ON" : "OFF"}
                  </span>
                </td>
                <td className="p-3 hidden lg:table-cell">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      event.isHazard
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {event.isHazard ? "HAZARD" : "SAFE"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;
