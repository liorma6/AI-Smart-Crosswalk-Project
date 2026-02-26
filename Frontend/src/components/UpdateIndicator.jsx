import React from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

const UpdateIndicator = ({ lastUpdate, isUpdating, isConnected = true, onRefresh }) => {
  const getTimeAgo = (date) => {
    if (!date) return 'טוען...';
    
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 10) return 'עכשיו';
    if (seconds < 60) return `לפני ${seconds} שניות`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `לפני ${minutes} דקות`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `לפני ${hours} שעות`;
    
    const days = Math.floor(hours / 24);
    return `לפני ${days} ימים`;
  };

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
        isConnected 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
      }`}>
        {isConnected ? (
          <>
            <Wifi size={14} />
            <span>מחובר</span>
          </>
        ) : (
          <>
            <WifiOff size={14} />
            <span>לא מחובר</span>
          </>
        )}
      </div>

      {/* Last Update Time */}
      <div className="flex items-center gap-1.5 text-xs text-gray-600">
        <RefreshCw 
          size={14} 
          className={`${isUpdating ? 'animate-spin text-blue-600' : ''}`}
        />
        <span>עדכון אחרון: {getTimeAgo(lastUpdate)}</span>
      </div>

      {/* Manual Refresh Button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isUpdating}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="רענן עכשיו"
        >
          <RefreshCw 
            size={16} 
            className={`text-gray-600 ${isUpdating ? 'animate-spin' : ''}`}
          />
        </button>
      )}
    </div>
  );
};

export default UpdateIndicator;

export const UpdateToast = ({ show, message = 'הנתונים עודכנו' }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <RefreshCw size={18} />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

