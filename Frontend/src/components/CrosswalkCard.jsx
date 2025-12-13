import React from "react";
import { Camera, Lightbulb, Cpu, Wifi, CloudRain, Sun, Cloud } from "lucide-react";
import MiniMap from "./MiniMap";

// Helper component for weather icons
const WeatherIcon = ({ condition }) => {
  if (condition === "Rainy")
    return <CloudRain size={16} className="text-blue-500" />;
  if (condition === "Sunny")
    return <Sun size={16} className="text-yellow-500" />;
  return <Cloud size={16} className="text-gray-400" />;
};

const CrosswalkCard = ({ crosswalk }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{crosswalk.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
              <Wifi
                size={12}
                className={
                  crosswalk.network.signal === "Weak"
                    ? "text-red-500"
                    : "text-green-600"
                }
              />
              <span>{crosswalk.network.ping}</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
              <WeatherIcon condition={crosswalk.environment.weather} />
              <span>{crosswalk.environment.temp}°C</span>
            </div>
          </div>
        </div>

        <span
          className={`px-2 py-1 rounded text-xs font-bold uppercase ${
            crosswalk.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {crosswalk.status}
        </span>
      </div>

      <hr className="border-gray-100" />

      {/* Mini Map */}
      {crosswalk.location && (
        <MiniMap
          location={crosswalk.location}
          name={crosswalk.name}
          status={crosswalk.status}
        />
      )}

      <div className="flex gap-4 text-sm text-gray-500 justify-around">
        <div
          className={`flex flex-col items-center gap-1 ${
            crosswalk.hardware.camera ? "text-blue-600" : "text-gray-300"
          }`}
        >
          <Camera size={20} />
          <span className="text-[10px] font-bold">CAM</span>
        </div>
        <div
          className={`flex flex-col items-center gap-1 ${
            crosswalk.hardware.ledPanel ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          <Lightbulb size={20} />
          <span className="text-[10px] font-bold">LED</span>
        </div>
        <div
          className={`flex flex-col items-center gap-1 ${
            crosswalk.hardware.controller ? "text-purple-600" : "text-gray-300"
          }`}
        >
          <Cpu size={20} />
          <span className="text-[10px] font-bold">CPU</span>
        </div>
      </div>
    </div>
  );
};

export default CrosswalkCard;
