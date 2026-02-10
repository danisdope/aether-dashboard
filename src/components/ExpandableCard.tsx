'use client';

import { useState, ReactNode } from 'react';

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  badgeColor?: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  preview: ReactNode;
  expanded: ReactNode;
  defaultExpanded?: boolean;
}

export function ExpandableCard({
  title,
  subtitle,
  icon,
  badge,
  badgeColor = 'gray',
  preview,
  expanded,
  defaultExpanded = false,
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const badgeColors = {
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        isExpanded
          ? 'bg-gray-800/80 border-gray-600 shadow-lg'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
      }`}
    >
      {/* Header - Always clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{title}</h3>
              {badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeColors[badgeColor]}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Preview content when collapsed */}
          {!isExpanded && <div className="hidden sm:block">{preview}</div>}
          
          {/* Expand/collapse icon */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-0 border-t border-gray-700">
          {expanded}
        </div>
      </div>
    </div>
  );
}
