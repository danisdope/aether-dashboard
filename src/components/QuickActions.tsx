'use client';

import { useState } from 'react';

interface QuickLink {
  label: string;
  url: string;
  icon: string;
  description: string;
}

const quickLinks: QuickLink[] = [
  { label: 'Test Scripts', url: '#test-scripts', icon: '🧪', description: 'Manual test scenarios' },
  { label: 'GitHub', url: 'https://github.com/danisdope/aetherion-edu-os', icon: '📦', description: 'Main codebase' },
  { label: 'Production', url: 'https://aetherion-core.vercel.app', icon: '🚀', description: 'Live app' },
  { label: 'Supabase', url: 'https://supabase.com/dashboard', icon: '🗄️', description: 'Database' },
  { label: 'Langfuse', url: 'https://cloud.langfuse.com', icon: '📊', description: 'LLM traces' },
  { label: 'Vercel', url: 'https://vercel.com/aetherion1', icon: '▲', description: 'Deployments' },
];

export function QuickActions() {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // In the future, this will send to Aether via API
      console.log('Message to Aether:', message);
      setMessage('');
      setShowMessage(false);
      // Show toast notification
      alert('Message sent to Aether! (Coming soon: real integration)');
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex flex-col items-center p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800 transition-all group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{link.icon}</span>
            <span className="text-xs font-medium text-gray-300">{link.label}</span>
          </a>
        ))}
      </div>

      {/* Message Aether */}
      <div className="relative">
        {showMessage ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Message Aether..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:outline-none text-white placeholder-gray-500"
              autoFocus
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
            >
              Send
            </button>
            <button
              onClick={() => setShowMessage(false)}
              className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowMessage(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800 transition-all text-gray-400 hover:text-white"
          >
            <span>💬</span>
            <span>Message Aether</span>
          </button>
        )}
      </div>
    </div>
  );
}
