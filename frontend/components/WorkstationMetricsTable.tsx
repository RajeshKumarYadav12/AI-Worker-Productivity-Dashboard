import { WorkstationMetrics } from '@/lib/types';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface WorkstationMetricsTableProps {
  workstations: WorkstationMetrics[];
}

function UtilBadge({ pct }: { pct: number }) {
  if (pct >= 75) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-sage/15 text-sage-dark border border-sage/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#8AB17D] inline-block" />
        {formatPercentage(pct)}
      </span>
    );
  }
  if (pct >= 50) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber/15 text-amber-dark border border-amber/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E9C46A] inline-block" />
        {formatPercentage(pct)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-coral/15 text-coral-dark border border-coral/30">
      <span className="w-1.5 h-1.5 rounded-full bg-[#E76F51] inline-block" />
      {formatPercentage(pct)}
    </span>
  );
}

function OccupancyBar({ pct }: { pct: number }) {
  const color = pct >= 75 ? '#8AB17D' : pct >= 50 ? '#E9C46A' : '#E76F51';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-[80px] h-2 bg-[#E1E5EA] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-ink-secondary w-10 text-right tabular-nums">
        {formatPercentage(pct)}
      </span>
    </div>
  );
}

export default function WorkstationMetricsTable({
  workstations,
}: WorkstationMetricsTableProps) {
  if (workstations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center text-ink-muted">
        No workstation data available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2A9D8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-navy">Workstation Performance</h2>
          <p className="text-xs text-ink-muted">{workstations.length} stations tracked</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-secondary uppercase tracking-wider">Station</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-secondary uppercase tracking-wider">Occupancy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-secondary uppercase tracking-wider w-52">Utilization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-secondary uppercase tracking-wider">Units Produced</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-secondary uppercase tracking-wider">Throughput</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {workstations.map((station) => (
              <tr key={station.station_id} className="hover:bg-surface/60 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                      style={{ backgroundColor: '#2A9D8F' }}
                    >
                      {station.station_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">{station.station_name}</p>
                      <p className="text-xs font-mono text-ink-muted">{station.station_id}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-navy font-medium">{formatNumber(station.occupancy_hours)}</span>
                  <span className="text-xs text-ink-muted ml-1">hrs</span>
                </td>

                <td className="px-6 py-4">
                  <OccupancyBar pct={station.utilization_percentage} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-navy tabular-nums">
                    {station.total_units_produced.toLocaleString()}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal/10 text-teal border border-teal/20">
                    {formatNumber(station.throughput_rate)} u/hr
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
