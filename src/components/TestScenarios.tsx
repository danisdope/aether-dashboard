'use client';

import { useState } from 'react';

interface Scenario {
  id: number;
  name: string;
  category: 'happy' | 'persona' | 'resistance' | 'edge' | 'chaos';
  time: string;
  script: string[];
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  notes?: string;
}

const scenarios: Scenario[] = [
  {
    id: 2,
    name: 'Happy Path Indonesian',
    category: 'happy',
    time: '3 min',
    status: 'pending',
    script: [
      'You: "Halo, mau tanya soal les bahasa Inggris"',
      'Bot: [Greeting + asks child name/age]',
      'You: "Anak saya Budi, umur 8 tahun"',
      'Bot: [SPIN Q1: What brings you...]',
      'You: "Ingin anak lebih percaya diri bicara"',
      'Bot: [SPIN Q2: Current level...]',
      'You: "Baru belajar dasar di sekolah"',
      'Bot: [SPIN Q3: Goals...]',
      'You: "Supaya bisa ngobrol sama turis"',
      'Bot: [Program recommendation + asks schedule]',
      'You: "Hari Sabtu sore bisa"',
      'Bot: [Confirms slot + asks email]',
      'You: "email@test.com"',
      'Bot: [Booking confirmed + sends email]',
    ],
  },
  {
    id: 3,
    name: 'Code-Switch (ID/EN)',
    category: 'happy',
    time: '3 min',
    status: 'pending',
    script: [
      'You: "Hi, I want to ask about English class"',
      'Bot: [English response]',
      'You: "Anak saya namanya Sarah, 10 tahun"',
      'Bot: [Should switch to Indonesian or stay mixed]',
      'Continue SPIN in mixed language...',
    ],
  },
  {
    id: 4,
    name: 'Busy Parent',
    category: 'persona',
    time: '2 min',
    status: 'pending',
    script: [
      'You: "Quick question - how much and when?"',
      'Bot: [Should still do intake but be concise]',
      'You: Short, impatient answers',
      'Verify: Bot adapts to brevity',
    ],
  },
  {
    id: 5,
    name: 'Detailed Parent',
    category: 'persona',
    time: '4 min',
    status: 'pending',
    script: [
      'You: Long paragraphs about child\'s history',
      'Bot: [Should acknowledge and summarize]',
      'Verify: Bot doesn\'t get overwhelmed',
    ],
  },
  {
    id: 6,
    name: 'Skeptical Parent',
    category: 'resistance',
    time: '4 min',
    status: 'pending',
    script: [
      'You: "Is this really free? What\'s the catch?"',
      'You: "How do I know the teachers are good?"',
      'You: "My friend tried English lessons and it didn\'t work"',
      'Verify: Bot handles objections gracefully',
    ],
  },
  {
    id: 7,
    name: 'Confused Parent',
    category: 'persona',
    time: '3 min',
    status: 'pending',
    script: [
      'You: "I don\'t understand, what do I need to do?"',
      'You: Answer questions incorrectly',
      'Verify: Bot clarifies and guides patiently',
    ],
  },
  {
    id: 8,
    name: 'Won\'t Give Name',
    category: 'resistance',
    time: '3 min',
    status: 'pending',
    script: [
      'You: "I\'d rather not say"',
      'You: "Just call him my son"',
      'Verify: Bot uses soft re-ask, doesn\'t break',
    ],
  },
  {
    id: 9,
    name: 'Privacy Concern',
    category: 'resistance',
    time: '3 min',
    status: 'pending',
    script: [
      'You: "Why do you need my email?"',
      'You: "I don\'t want to share personal info"',
      'Verify: Bot explains value, respects concern',
    ],
  },
  {
    id: 10,
    name: 'Hesitation',
    category: 'resistance',
    time: '2 min',
    status: 'pending',
    script: [
      'You: "I need to think about it"',
      'You: "Maybe later"',
      'Verify: Bot doesn\'t push too hard',
    ],
  },
  {
    id: 11,
    name: 'Cancellation',
    category: 'resistance',
    time: '2 min',
    status: 'pending',
    script: [
      'Complete booking, then:',
      'You: "Actually I need to cancel"',
      'Verify: Bot handles gracefully',
    ],
  },
  {
    id: 12,
    name: 'Request Human',
    category: 'resistance',
    time: '2 min',
    status: 'pending',
    script: [
      'You: "Can I speak to a real person?"',
      'Verify: Bot escalates appropriately',
    ],
  },
];

export function TestScenarios() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'passed' | 'failed'>('all');

  const filteredScenarios = scenarios.filter(s => 
    filter === 'all' ? true : s.status === filter
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'happy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'persona': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resistance': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'edge': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'chaos': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'skipped': return '⏭️';
      default: return '⬜';
    }
  };

  const completedCount = scenarios.filter(s => s.status === 'passed').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Test Scenarios</h3>
          <p className="text-sm text-gray-500">
            {completedCount}/{scenarios.length} completed • Today: #2-12
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'passed', 'failed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Scenarios List */}
      <div className="space-y-2">
        {filteredScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`rounded-lg border transition-all ${
              expandedId === scenario.id
                ? 'bg-gray-800/80 border-gray-600'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            {/* Scenario Header */}
            <button
              onClick={() => setExpandedId(expandedId === scenario.id ? null : scenario.id)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{getStatusIcon(scenario.status)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-400">#{scenario.id}</span>
                    <span className="font-medium text-white">{scenario.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(scenario.category)}`}>
                      {scenario.category}
                    </span>
                    <span className="text-xs text-gray-500">~{scenario.time}</span>
                  </div>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedId === scenario.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded Script */}
            {expandedId === scenario.id && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-700">
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Script</p>
                  <div className="bg-gray-900/50 rounded-lg p-3 font-mono text-sm space-y-1">
                    {scenario.script.map((line, i) => (
                      <p key={i} className={`${
                        line.startsWith('You:') ? 'text-indigo-400' :
                        line.startsWith('Bot:') ? 'text-green-400' :
                        line.startsWith('Verify:') ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-medium transition-colors">
                      ✅ Pass
                    </button>
                    <button className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors">
                      ❌ Fail
                    </button>
                    <button className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium transition-colors">
                      ⏭️ Skip
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
