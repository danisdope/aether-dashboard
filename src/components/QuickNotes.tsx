'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: string;
  text: string;
  timestamp: string;
  category: 'idea' | 'task' | 'bug' | 'note';
}

export function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [category, setCategory] = useState<Note['category']>('note');

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aether-quick-notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('aether-quick-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      text: newNote.trim(),
      timestamp: new Date().toISOString(),
      category,
    };
    
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'idea': return '💡';
      case 'task': return '📌';
      case 'bug': return '🐛';
      default: return '📝';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'idea': return 'border-l-yellow-500';
      case 'task': return 'border-l-blue-500';
      case 'bug': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-xl p-4 bg-gray-800/50 border border-gray-700">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
        <span>📝</span> Quick Notes
      </h3>

      {/* Add Note Input */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Note['category'])}
            className="px-2 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm"
          >
            <option value="note">📝 Note</option>
            <option value="idea">💡 Idea</option>
            <option value="task">📌 Task</option>
            <option value="bug">🐛 Bug</option>
          </select>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNote()}
            placeholder="Capture a thought..."
            className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:outline-none text-white placeholder-gray-500 text-sm"
          />
        </div>
        <button
          onClick={addNote}
          className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No notes yet. Capture your thoughts!
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`flex items-start justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-700 border-l-4 ${getCategoryColor(note.category)}`}
            >
              <div className="flex items-start gap-2 flex-1">
                <span className="text-sm">{getCategoryEmoji(note.category)}</span>
                <div>
                  <p className="text-sm text-gray-300">{note.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(note.timestamp)}</p>
                </div>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-gray-500 hover:text-red-400 transition-colors ml-2"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
