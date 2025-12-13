import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MiniMap = ({ location, name, status }) => {
  const { lat, lng } = location;

  // Custom icon based on status
  const getMarkerColor = () => {
    switch (status) {
      case "active":
        return "#22c55e"; // green
      case "maintenance":
        return "#f59e0b"; // orange
      case "inactive":
        return "#ef4444"; // red
      default:
        return "#3b82f6"; // blue
    }
  };

  const customIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${getMarkerColor()}" d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0Z"/>
        <circle cx="12" cy="8" r="3" fill="white"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div className="w-full h-40 rounded-lg overflow-hidden border-2 border-gray-200 relative">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        style={{ height: "100%", width: "100%", maxWidth: "100%", position: "relative" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>
            <div className="text-sm">
              <strong>{name}</strong>
              <br />
              <span className="text-gray-600">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MiniMap;
