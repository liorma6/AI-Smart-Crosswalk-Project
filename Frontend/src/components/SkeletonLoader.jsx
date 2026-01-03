import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="group bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden animate-pulse">
      <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>

          <div className="h-10 bg-gray-100 rounded-lg"></div>

          <div className="pt-3 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonTable = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
            <div className="h-10 w-10 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonStats = () => {
  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 w-8 bg-gray-400 rounded"></div>
        <div className="h-6 w-6 bg-gray-400 rounded"></div>
      </div>
      <div className="h-10 bg-gray-400 rounded w-20 mb-2"></div>
      <div className="h-4 bg-gray-400 rounded w-32"></div>
    </div>
  );
};

export const SkeletonAlert = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border-r-[6px] border-gray-300 overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="h-[300px] bg-gray-100 rounded flex items-end justify-around gap-2 p-4">
        {[60, 80, 40, 90, 50, 70].map((height, i) => (
          <div 
            key={i} 
            className="bg-gray-300 rounded-t w-full"
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8 text-white">
        <div className="h-6 w-32 bg-white/20 rounded mb-6"></div>

        <div className="flex items-start justify-between flex-wrap gap-6">
          <div className="flex-1">
            <div className="h-10 bg-white/20 rounded w-64 mb-3"></div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-8 w-48 bg-white/10 rounded-lg"></div>
              <div className="h-8 w-40 bg-white/10 rounded-lg"></div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="h-10 w-32 bg-white/20 rounded-full"></div>
            <div className="h-6 w-28 bg-white/10 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="h-8 bg-white/20 rounded w-16 mb-1"></div>
              <div className="h-4 bg-white/20 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

