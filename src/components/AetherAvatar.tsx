'use client';

import { useEffect, useState } from 'react';

interface AetherStatus {
  isOnline: boolean;
  status: 'idle' | 'working' | 'thinking' | 'offline';
  currentTask: string | null;
  lastSeen: string;
}

export function AetherAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const [status, setStatus] = useState<AetherStatus>({
    isOnline: true,
    status: 'working',
    currentTask: 'Building your dashboard',
    lastSeen: new Date().toISOString(),
  });

  const [blink, setBlink] = useState(false);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'working': return 'bg-blue-500';
      case 'thinking': return 'bg-yellow-500';
      case 'idle': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusPulse = () => {
    if (status.status === 'working' || status.status === 'thinking') {
      return 'animate-pulse';
    }
    return '';
  };

  return (
    <div className="relative inline-flex items-center gap-3">
      {/* Owl Avatar */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Face circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-lg">
          {/* Owl face details */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Face disc */}
            <ellipse cx="50" cy="55" rx="35" ry="32" fill="#D97706" />
            
            {/* Left eye socket */}
            <circle cx="35" cy="45" r="18" fill="#1F2937" />
            {/* Right eye socket */}
            <circle cx="65" cy="45" r="18" fill="#1F2937" />
            
            {/* Left eye white */}
            <circle cx="35" cy="45" r="14" fill="#FEF3C7" />
            {/* Right eye white */}
            <circle cx="65" cy="45" r="14" fill="#FEF3C7" />
            
            {/* Left pupil - moves slightly based on status */}
            <circle 
              cx={status.status === 'thinking' ? "37" : "35"} 
              cy={status.status === 'working' ? "43" : "45"} 
              r="7" 
              fill="#1F2937"
            />
            {/* Right pupil */}
            <circle 
              cx={status.status === 'thinking' ? "67" : "65"} 
              cy={status.status === 'working' ? "43" : "45"} 
              r="7" 
              fill="#1F2937"
            />
            
            {/* Eye shine */}
            <circle cx="32" cy="42" r="3" fill="white" opacity="0.8" />
            <circle cx="62" cy="42" r="3" fill="white" opacity="0.8" />
            
            {/* Eyelids when blinking */}
            {blink && (
              <>
                <ellipse cx="35" cy="45" rx="15" ry="12" fill="#92400E" />
                <ellipse cx="65" cy="45" rx="15" ry="12" fill="#92400E" />
              </>
            )}
            
            {/* Beak */}
            <path d="M 45 58 L 50 68 L 55 58 Z" fill="#F59E0B" />
            
            {/* Ear tufts */}
            <path d="M 15 25 Q 20 35 28 38" stroke="#92400E" strokeWidth="4" fill="none" />
            <path d="M 85 25 Q 80 35 72 38" stroke="#92400E" strokeWidth="4" fill="none" />
          </svg>
        </div>
        
        {/* Status indicator */}
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor()} ${getStatusPulse()} rounded-full border-2 border-gray-950`} />
      </div>

      {/* Status text */}
      {size !== 'sm' && (
        <div className="flex flex-col">
          <span className="font-semibold text-white">Aether</span>
          <span className={`text-xs ${status.isOnline ? 'text-green-400' : 'text-gray-500'}`}>
            {status.status === 'working' && status.currentTask 
              ? status.currentTask 
              : status.status === 'thinking' 
              ? 'Thinking...'
              : status.isOnline 
              ? 'Online' 
              : 'Offline'}
          </span>
        </div>
      )}
    </div>
  );
}
