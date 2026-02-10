'use client';

import { useState } from 'react';

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AlertsBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'info',
      message: '🦉 Aether completed overnight work: Dashboard upgraded with tabs, Kanban, and roadmap.',
    },
  ]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (alerts.length === 0) return null;

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      case 'success': return 'bg-green-500/10 border-green-500/30 text-green-300';
      default: return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';
    }
  };

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center justify-between px-4 py-3 rounded-lg border ${getAlertStyle(alert.type)}`}
        >
          <span className="text-sm">{alert.message}</span>
          <div className="flex items-center gap-2">
            {alert.action && (
              <button
                onClick={alert.action.onClick}
                className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
              >
                {alert.action.label}
              </button>
            )}
            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
