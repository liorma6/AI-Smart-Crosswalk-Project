import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#ef4444"];

const StatsChart = ({ stats }) => {
  const safeStats =
    stats && stats.length >= 2
      ? stats
      : [
          { name: "Detection Only", value: 0 },
          { name: "True Alert (LEDs)", value: 0 },
        ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h2 className="font-bold text-gray-700 mb-2 w-full text-center">
        Efficiency Stats
      </h2>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeStats}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {safeStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full mt-2 space-y-2">
        <div className="flex justify-between text-xs border-b border-gray-100 pb-1">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Passive Detection
          </span>
          <span className="font-bold">{safeStats[0].value}%</span>
        </div>
        <div className="flex justify-between text-xs pt-1">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Active Alerts
          </span>
          <span className="font-bold">{safeStats[1].value}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatsChart;
