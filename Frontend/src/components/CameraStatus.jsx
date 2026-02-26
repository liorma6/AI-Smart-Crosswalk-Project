import React from 'react';
import { Camera, WifiOff, AlertCircle } from 'lucide-react';

const CameraStatus = ({ status, size = 'md', showLabel = true }) => {
  const getStatusConfig = () => {
    switch(status) {
      case 'active':
      case 'online':
        return {
          icon: Camera,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-300',
          label: 'מצלמה פעילה',
          pulseColor: 'bg-green-400'
        };
      case 'offline':
      case 'inactive':
        return {
          icon: WifiOff,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300',
          label: 'מצלמה לא פעילה',
          pulseColor: null
        };
      case 'maintenance':
      case 'warning':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-300',
          label: 'מצלמה בתחזוקה',
          pulseColor: null
        };
      default:
        return {
          icon: Camera,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-300',
          label: 'סטטוס לא ידוע',
          pulseColor: null
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      icon: 16,
      pulse: 'h-2 w-2',
      text: 'text-xs'
    },
    md: {
      container: 'w-10 h-10',
      icon: 20,
      pulse: 'h-2.5 w-2.5',
      text: 'text-sm'
    },
    lg: {
      container: 'w-12 h-12',
      icon: 24,
      pulse: 'h-3 w-3',
      text: 'text-base'
    }
  };

  const sizeConfig = sizeClasses[size];

  if (!showLabel) {
    return (
      <div className="relative inline-flex">
        <div className={`${sizeConfig.container} ${config.bgColor} ${config.borderColor} border rounded-full flex items-center justify-center`}>
          <Icon size={sizeConfig.icon} className={config.color} />
        </div>
        {config.pulseColor && (
          <span className="absolute top-0 left-0">
            <span className={`animate-ping absolute inline-flex ${sizeConfig.pulse} rounded-full ${config.pulseColor} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full ${sizeConfig.pulse} ${config.pulseColor}`}></span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeConfig.container} ${config.bgColor} ${config.borderColor} border rounded-full flex items-center justify-center`}>
          <Icon size={sizeConfig.icon} className={config.color} />
        </div>
        {config.pulseColor && (
          <span className="absolute top-0 left-0">
            <span className={`animate-ping absolute inline-flex ${sizeConfig.pulse} rounded-full ${config.pulseColor} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full ${sizeConfig.pulse} ${config.pulseColor}`}></span>
          </span>
        )}
      </div>
      <span className={`${sizeConfig.text} font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

export default CameraStatus;

