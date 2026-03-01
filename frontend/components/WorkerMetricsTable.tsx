import { WorkerMetrics } from '@/lib/types';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface Props { workers: WorkerMetrics[]; }

function utilizationStyle(pct: number): { barColor: string; badgeBg: string; badgeText: string; label: string } {
  if (pct >= 80) return { barColor: '#8AB17D', badgeBg: '#E2EFE0', badgeText: '#4D7A42', label: 'High' };
  if (pct >= 60) return { barColor: '#E9C46A', badgeBg: '#FAF3DC', badgeText: '#8A6A10', label: 'Medium' };
  return { barColor: '#E76F51', badgeBg: '#FADFDA', badgeText: '#B84A2F', label: 'Low' };
}

export default function WorkerMetricsTable({ workers }: Props) {
  if (workers.length === 0) {
    return (
      <div
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E1E5EA', borderRadius: 8 }}
        className="p-8 text-center"
      >
        <p style={{ color: '#8A9BAC' }}>No worker data available</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E1E5EA', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(26,43,60,0.07)' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #E1E5EA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#2A9D8F' }} aria-hidden="true">
            <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14 9a3 3 0 010-6M17.5 17c0-2.8-1.6-5.2-3.9-6.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h2 className="text-base font-semibold" style={{ color: '#1A2B3C' }}>Worker Performance</h2>
        </div>
        <span className="text-xs" style={{ color: '#8A9BAC' }}>{workers.length} workers</span>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F5F7FA' }}>
              {['Worker', 'Active Hours', 'Idle Hours', 'Utilization', 'Units Produced', 'Units / hr'].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#8A9BAC',
                    borderBottom: '1px solid #E1E5EA',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workers.map((w, idx) => {
              const s = utilizationStyle(w.utilization_percentage);
              return (
                <tr
                  key={w.worker_id}
                  className="hover:bg-surface/60 transition-colors"
                  style={{
                    borderBottom: idx < workers.length - 1 ? '1px solid #E1E5EA' : 'none',
                  }}
                >
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#D1EFEC',
                          color: '#1F7A70',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {w.worker_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2B3C' }}>{w.worker_name}</div>
                        <div style={{ fontSize: 11, color: '#8A9BAC', fontFamily: 'monospace' }}>{w.worker_id}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#1A2B3C', whiteSpace: 'nowrap' }}>
                    {formatNumber(w.total_active_hours)}{' '}
                    <span style={{ color: '#8A9BAC', fontSize: 11 }}>hrs</span>
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#1A2B3C', whiteSpace: 'nowrap' }}>
                    {formatNumber(w.total_idle_hours)}{' '}
                    <span style={{ color: '#8A9BAC', fontSize: 11 }}>hrs</span>
                  </td>

                  <td style={{ padding: '12px 16px', minWidth: 140 }}>
                    <div className="flex items-center gap-2">
                      <div style={{ flex: 1, backgroundColor: '#E1E5EA', borderRadius: 99, height: 6, overflow: 'hidden', minWidth: 60 }}>
                        <div
                          style={{
                            width: `${Math.min(w.utilization_percentage, 100)}%`,
                            height: '100%',
                            backgroundColor: s.barColor,
                            borderRadius: 99,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 99,
                          backgroundColor: s.badgeBg,
                          color: s.badgeText,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatPercentage(w.utilization_percentage)}
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#1A2B3C', whiteSpace: 'nowrap' }}>
                    {w.total_units_produced.toLocaleString()}
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#1A2B3C', whiteSpace: 'nowrap' }}>
                    {formatNumber(w.units_per_hour)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
