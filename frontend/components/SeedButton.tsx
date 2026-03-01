'use client';

import { useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [message, setMessage] = useState('');

  async function handleSeed() {
    setLoading(true);
    setStatus('idle');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/seed`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setStatus('ok');
        setMessage('Data refreshed — reload to see updates.');
      } else {
        setStatus('err');
        setMessage(json.error ?? 'Seed failed');
      }
    } catch (e: unknown) {
      setStatus('err');
      setMessage(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleSeed}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-colors"
        style={{ backgroundColor: loading ? '#238a7d' : '#2A9D8F' }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#238a7d'; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2A9D8F'; }}
      >
        {loading ? (
          <>
            <span
              className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
            />
            <span className="hidden sm:inline">Seeding…</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.45" />
            </svg>
            <span className="hidden sm:inline">Refresh Demo Data</span>
          </>
        )}
      </button>
      {message && (
        <span className={`text-xs max-w-xs text-right ${status === 'ok' ? 'text-teal' : 'text-coral'}`}>
          {message}
        </span>
      )}
    </div>
  );
}
