import React, { useState, useEffect } from 'react';
import { fetchCrosswalks, fetchAlerts } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Activity, Camera, Calendar } from 'lucide-react';
import { SkeletonStats, SkeletonChart } from '../components/SkeletonLoader';

const Statistics = () => {
  const [crosswalks, setCrosswalks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [crosswalksData, alertsData] = await Promise.all([
          fetchCrosswalks(),
          fetchAlerts()
        ]);
        setCrosswalks(crosswalksData || []);
        setAlerts(alertsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const statusData = [
    { name: 'פעיל', value: crosswalks.filter(c => c.status === 'active').length, color: '#10b981' },
    { name: 'תחזוקה', value: crosswalks.filter(c => c.status === 'maintenance').length, color: '#f59e0b' },
    { name: 'לא פעיל', value: crosswalks.filter(c => c.status === 'inactive').length, color: '#ef4444' }
  ];

  const hazardData = [
    { name: 'סכנה גבוהה', value: alerts.filter(a => a.isHazard).length, color: '#dc2626' },
    { name: 'אזהרה', value: alerts.filter(a => !a.isHazard).length, color: '#f59e0b' }
  ];

  const ledActivationData = [
    { name: 'LED הופעל', value: alerts.filter(a => a.ledActivated).length, color: '#3b82f6' },
    { name: 'זיהוי בלבד', value: alerts.filter(a => !a.ledActivated).length, color: '#6b7280' }
  ];

  const alertsByCrosswalk = crosswalks.map(crosswalk => {
    const crosswalkAlerts = alerts.filter(alert => {
      const alertCrosswalkId = typeof alert.crosswalkId === 'object' 
        ? alert.crosswalkId._id 
        : alert.crosswalkId;
      return alertCrosswalkId === crosswalk._id;
    });
    return {
      name: crosswalk.name.split(',')[1]?.trim() || crosswalk.name,
      התרעות: crosswalkAlerts.length,
      סכנה: crosswalkAlerts.filter(a => a.isHazard).length
    };
  }).sort((a, b) => b.התרעות - a.התרעות);

  const alertsTimeline = alerts
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .reduce((acc, alert) => {
      const date = new Date(alert.timestamp).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
      const existing = acc.find(item => item.תאריך === date);
      if (existing) {
        existing.התרעות += 1;
        if (alert.isHazard) existing.סכנה += 1;
      } else {
        acc.push({ תאריך: date, התרעות: 1, סכנה: alert.isHazard ? 1 : 0 });
      }
      return acc;
    }, []);

  const avgDistance = alerts.length > 0
    ? (alerts.reduce((sum, a) => sum + (a.detectionDistance || 0), 0) / alerts.length).toFixed(2)
    : 0;

  const avgObjects = alerts.length > 0
    ? (alerts.reduce((sum, a) => sum + (a.detectedObjectsCount || 0), 0) / alerts.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-20 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonStats key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonChart key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">סטטיסטיקות מערכת</h1>
              <p className="text-gray-600">ניתוח נתונים וביצועים</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('day')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeRange === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                היום
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                שבוע
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                חודש
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Activity size={32} />
              <TrendingUp size={24} className="opacity-75" />
            </div>
            <div className="text-4xl font-bold mb-2">{alerts.length}</div>
            <div className="text-blue-100 text-sm">סך הכל התרעות</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={32} />
              <TrendingUp size={24} className="opacity-75" />
            </div>
            <div className="text-4xl font-bold mb-2">{alerts.filter(a => a.isHazard).length}</div>
            <div className="text-red-100 text-sm">אירועי סכנה</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Camera size={32} />
              <Activity size={24} className="opacity-75" />
            </div>
            <div className="text-4xl font-bold mb-2">{crosswalks.length}</div>
            <div className="text-green-100 text-sm">מעברי חצייה</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calendar size={32} />
              <TrendingUp size={24} className="opacity-75" />
            </div>
            <div className="text-4xl font-bold mb-2">{avgDistance}m</div>
            <div className="text-purple-100 text-sm">מרחק ממוצע</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">סטטוס מעברי חצייה</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">התפלגות סוגי התרעות</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={hazardData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {hazardData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">הפעלת LED</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ledActivationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ledActivationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">מדדים נוספים</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">ממוצע אובייקטים לאירוע</span>
                <span className="text-2xl font-bold text-blue-600">{avgObjects}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">אחוז הפעלת LED</span>
                <span className="text-2xl font-bold text-green-600">
                  {alerts.length > 0 ? ((alerts.filter(a => a.ledActivated).length / alerts.length) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <span className="text-gray-700 font-medium">אחוז אירועי סכנה</span>
                <span className="text-2xl font-bold text-red-600">
                  {alerts.length > 0 ? ((alerts.filter(a => a.isHazard).length / alerts.length) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">התרעות לפי מעבר חצייה</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={alertsByCrosswalk}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="התרעות" fill="#3b82f6" />
                <Bar dataKey="סכנה" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">מגמת התרעות לאורך זמן</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={alertsTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="תאריך" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="התרעות" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="סכנה" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

