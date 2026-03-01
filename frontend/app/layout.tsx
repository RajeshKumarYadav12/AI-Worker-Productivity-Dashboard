import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SeedButton from '@/components/SeedButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Worker Productivity Dashboard',
  description: 'Real-time factory productivity monitoring and analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: '#F5F7FA', color: '#1A2B3C' }}>
        <div className="min-h-screen flex flex-col">

          <header style={{ backgroundColor: '#1A2B3C' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="3" y="15" width="28" height="16" rx="1.5" fill="#2A9D8F" />
                  <rect x="7" y="8" width="8" height="7" rx="1" fill="#3BB5A6" />
                  <rect x="19" y="8" width="8" height="7" rx="1" fill="#3BB5A6" />
                  <rect x="13" y="19" width="8" height="12" rx="1" fill="#1A2B3C" />
                  <rect x="8" y="20" width="4" height="4" rx="0.5" fill="#F5F7FA" opacity="0.5" />
                  <rect x="22" y="20" width="4" height="4" rx="0.5" fill="#F5F7FA" opacity="0.5" />
                </svg>
                <div>
                  <h1 className="text-sm sm:text-lg font-bold tracking-tight leading-tight" style={{ color: '#F5F7FA' }}>
                    <span className="hidden sm:inline">AI Worker Productivity Dashboard</span>
                    <span className="sm:hidden">AI Productivity</span>
                  </h1>
                  <p className="text-xs hidden sm:block" style={{ color: '#8A9BAC' }}>
                    Real-time factory monitoring
                  </p>
                </div>
              </div>
              <SeedButton />
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer style={{ backgroundColor: '#1A2B3C' }}>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#2A9D8F22' }}>
                      <svg width="20" height="20" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect x="3" y="15" width="28" height="16" rx="1.5" fill="#2A9D8F" />
                        <rect x="7" y="8" width="8" height="7" rx="1" fill="#3BB5A6" />
                        <rect x="19" y="8" width="8" height="7" rx="1" fill="#3BB5A6" />
                        <rect x="13" y="19" width="8" height="12" rx="1" fill="#1A2B3C" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight" style={{ color: '#F5F7FA' }}>AI Worker Productivity</p>
                      <p className="text-xs" style={{ color: '#2A9D8F' }}>Dashboard</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed max-w-xs" style={{ color: '#8A9BAC' }}>
                    Real-time monitoring of factory worker productivity and workstation performance, powered by AI-driven event detection from CCTV cameras.
                  </p>

                  <div className="flex items-center gap-2 mt-5">
                    <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: '#8AB17D' }} />
                    <span className="text-xs font-medium" style={{ color: '#8AB17D' }}>All systems operational</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#2A9D8F' }}>What We Track</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { icon: '▸', label: 'Worker active & idle hours', accent: '#2A9D8F' },
                      { icon: '▸', label: 'Per-worker units produced & rate', accent: '#8AB17D' },
                      { icon: '▸', label: 'Workstation occupancy & utilization', accent: '#E9C46A' },
                      { icon: '▸', label: 'Workstation throughput rate', accent: '#E76F51' },
                      { icon: '▸', label: 'Factory-wide aggregate metrics', accent: '#2A9D8F' },
                    ].map(({ icon, label, accent }) => (
                      <div key={label} className="flex items-center gap-2.5">
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: accent }}>{icon}</span>
                        <span className="text-xs" style={{ color: '#8A9BAC' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5"
                style={{ borderTop: '1px solid #2A3F52' }}
              >
                <span className="text-xs" style={{ color: '#5A6B7C' }}>
                  &copy; 2026 AI Worker Productivity Dashboard &mdash; All rights reserved.
                </span>
                <div className="flex items-center gap-4">
                  {[
                    { dot: '#2A9D8F', text: 'Next.js + Express' },
                    { dot: '#8AB17D', text: 'SQLite' },
                    { dot: '#E9C46A', text: 'Recharts' },
                  ].map(({ dot, text }) => (
                    <div key={text} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                      <span className="text-xs" style={{ color: '#5A6B7C' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
