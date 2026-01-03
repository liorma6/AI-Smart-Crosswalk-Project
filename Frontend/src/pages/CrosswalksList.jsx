import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCrosswalks } from '../services/api';
import { Search, MapPin, Activity, AlertCircle, Filter, X } from 'lucide-react';
import CameraStatus from '../components/CameraStatus';
import { SkeletonCard } from '../components/SkeletonLoader';
import { useRealTimeUpdates, useUpdateNotification } from '../hooks/useRealTimeUpdates';
import UpdateIndicator, { UpdateToast } from '../components/UpdateIndicator';

const CrosswalksList = () => {
  const navigate = useNavigate();
  const { data: crosswalks, loading, error, refetch, lastUpdate } = useRealTimeUpdates(fetchCrosswalks, 10000);
  const showUpdateToast = useUpdateNotification(lastUpdate);
  
  const [filteredCrosswalks, setFilteredCrosswalks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (crosswalks) {
      setFilteredCrosswalks(crosswalks);
    }
  }, [crosswalks]);

  useEffect(() => {
    if (!crosswalks) return;
    
    let filtered = [...crosswalks];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(crosswalk => {
        const name = crosswalk.name?.toLowerCase() || '';
        const status = crosswalk.status?.toLowerCase() || '';
        const id = crosswalk._id?.toLowerCase() || '';
        
        return name.includes(query) || status.includes(query) || id.includes(query);
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(crosswalk => crosswalk.status === statusFilter);
    }

    setFilteredCrosswalks(filtered);
  }, [searchQuery, statusFilter, crosswalks]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setShowFilters(false);
  };

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0);
  
  const allCrosswalks = crosswalks || [];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return '🟢';
      case 'maintenance': return '🟡';
      case 'inactive': return '🔴';
      default: return '⚪';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'פעיל';
      case 'maintenance': return 'תחזוקה';
      case 'inactive': return 'לא פעיל';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-200 rounded"></div>
                <div className="h-16 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-12 bg-gray-100 rounded-xl mb-4"></div>
          </div>

          <div className="mb-4 px-2">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="mx-auto text-red-600 mb-3" size={48} />
          <p className="text-red-800 font-semibold mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <UpdateToast show={showUpdateToast && !loading} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">מעברי חצייה</h1>
              <p className="text-gray-600">ניהול וניטור כל מעברי החצייה במערכת</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <UpdateIndicator 
                lastUpdate={lastUpdate}
                isUpdating={loading}
                isConnected={!error}
                onRefresh={refetch}
              />
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{allCrosswalks.length}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">סה״כ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {allCrosswalks.filter(c => c.status === 'active').length}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">פעילים</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="חפש לפי שם רחוב, כתובת, מזהה או סטטוס..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right transition text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <Filter size={20} />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">סינון מתקדם</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                      <span>נקה הכל</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      statusFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    הכל ({allCrosswalks.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('active')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      statusFilter === 'active'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    פעיל ({allCrosswalks.filter(c => c.status === 'active').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('maintenance')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      statusFilter === 'maintenance'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    תחזוקה ({allCrosswalks.filter(c => c.status === 'maintenance').length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between px-2">
          <span className="text-sm font-medium text-gray-700">
            {filteredCrosswalks.length === allCrosswalks.length 
              ? `מציג ${allCrosswalks.length} מעברי חצייה`
              : `מציג ${filteredCrosswalks.length} מתוך ${allCrosswalks.length} מעברי חצייה`
            }
          </span>
        </div>

        {filteredCrosswalks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">לא נמצאו תוצאות</h3>
            <p className="text-gray-600 mb-4">נסה לחפש במילות חיפוש אחרות או שנה את הסינון</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                נקה סינונים
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrosswalks.map((crosswalk) => (
              <div
                key={crosswalk._id}
                onClick={() => navigate(`/crosswalk/${crosswalk._id}`)}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-blue-400 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                        {crosswalk.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 gap-1">
                        <MapPin size={14} className="text-blue-500" />
                        <span className="font-mono text-xs">
                          {crosswalk.location?.lat?.toFixed(4)}, {crosswalk.location?.lng?.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(crosswalk.status)}`}>
                        <span>{getStatusIcon(crosswalk.status)}</span>
                        <span>{getStatusText(crosswalk.status)}</span>
                      </div>
                      <CameraStatus status={crosswalk.status} size="sm" showLabel={false} />
                    </div>

                    {crosswalk.ledSystemUrl && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                        <Activity size={14} className="text-blue-500" />
                        <span className="font-mono truncate">{crosswalk.ledSystemUrl}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium">
                          צפה בפרטים →
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {crosswalk._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrosswalksList;

