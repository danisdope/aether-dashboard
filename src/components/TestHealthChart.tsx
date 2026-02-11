'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTestHealth } from '@/hooks/useTestHealth';

export function TestHealthChart() {
  const { data, loading, current, allPassing } = useTestHealth();

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 h-56 animate-pulse">
        <div className="h-4 w-32 bg-gray-700 rounded mb-4" />
        <div className="h-40 bg-gray-700/50 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-300">Test Health</h3>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${allPassing ? 'text-green-400' : 'text-yellow-400'}`}>
              {current?.passing || 0}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">{current?.total || 0}</span>
          </div>
          <span className={`text-xs ${allPassing ? 'text-green-400' : 'text-yellow-400'}`}>
            {allPassing ? '✓ All passing' : `${(current?.total || 0) - (current?.passing || 0)} failing`}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="passingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6b7280', fontSize: 10 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip 
              contentStyle={{ 
                background: '#1f2937', 
                border: '1px solid #374151', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
              }}
              labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Area
              type="monotone"
              dataKey="passing"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#passingGradient)"
              dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#6366f1" 
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              opacity={0.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          Passing
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-indigo-500 opacity-50" />
          Total
        </span>
      </div>
    </div>
  );
}
