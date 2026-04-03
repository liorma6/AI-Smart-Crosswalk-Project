import React from "react";
import { Camera, WifiOff, AlertCircle } from "lucide-react";

const CameraStatus = ({ status, size = "md", showLabel = true }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
      case "online":
        return {
          icon: Camera,
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
          label: "Camera active",
        };
      case "offline":
      case "inactive":
        return {
          icon: WifiOff,
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          label: "Camera offline",
        };
      case "maintenance":
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
          label: "Camera in maintenance",
        };
      default:
        return {
          icon: Camera,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-300",
          label: "Unknown status",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: "w-8 h-8",
      icon: 16,
      text: "text-xs",
    },
    md: {
      container: "w-10 h-10",
      icon: 20,
      text: "text-sm",
    },
    lg: {
      container: "w-12 h-12",
      icon: 24,
      text: "text-base",
    },
  };

  const sizeConfig = sizeClasses[size];

  if (!showLabel) {
    return (
      <div className="inline-flex">
        <div
          className={`${sizeConfig.container} ${config.bgColor} ${config.borderColor} border rounded-full flex items-center justify-center`}
        >
          <Icon size={sizeConfig.icon} className={config.color} />
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`${sizeConfig.container} ${config.bgColor} ${config.borderColor} border rounded-full flex items-center justify-center`}
      >
        <Icon size={sizeConfig.icon} className={config.color} />
      </div>
      <span className={`${sizeConfig.text} font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

export default CameraStatus;
