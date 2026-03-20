import { useEffect, useState } from 'react';

export default function Overview() {
  // Dummy analytics stats
  const stats = [
    { label: 'Total Orders', value: '1,248', change: '+12.5%' },
    { label: 'Revenue', value: '$18,492', change: '+8.2%' },
    { label: 'Active Devices', value: '42', change: '0%' },
    { label: 'Kitchens Online', value: '6', change: '+1' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Today's Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time metrics across all locations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2 hover:shadow-md transition">
            <span className="text-sm font-medium text-gray-500">{stat.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-400'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-96 flex items-center justify-center">
        <p className="text-gray-400 font-medium">AI Forecasting Chart Placeholder</p>
      </div>
    </div>
  );
}
