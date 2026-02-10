'use client';

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}

export function StatsBar() {
  const stats: Stat[] = [
    { label: 'Tests Passing', value: '469', icon: '✅', change: '100%', changeType: 'up' },
    { label: 'Promptfoo', value: '30', icon: '🧪', change: 'baseline', changeType: 'neutral' },
    { label: 'Week Progress', value: '15%', icon: '📈', change: 'Day 1/5', changeType: 'neutral' },
    { label: 'Streak', value: '8', icon: '🔥', change: 'days', changeType: 'up' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
        >
          <span className="text-2xl">{stat.icon}</span>
          <div>
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {stat.label}
              {stat.change && (
                <span className={`${
                  stat.changeType === 'up' ? 'text-green-500' :
                  stat.changeType === 'down' ? 'text-red-500' :
                  'text-gray-400'
                }`}>
                  • {stat.change}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
