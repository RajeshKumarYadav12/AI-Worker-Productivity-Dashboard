'use client';

import { WorkerMetrics, WorkstationMetrics } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface UtilizationChartProps {
  workers: WorkerMetrics[];
  workstations: WorkstationMetrics[];
}

function utilColor(pct: number) {
  if (pct >= 75) 
    return '#8AB17D';
  if (pct >= 50) 
    return '#E9C46A'; 
  return '#E76F51';                
}

export default function UtilizationChart({
  workers,
  workstations,
}: UtilizationChartProps) {
  const workerData = workers.map((w) => ({
    name: w.worker_name,
    utilization: Number(w.utilization_percentage.toFixed(1)),
  }));

  const workstationData = workstations.map((ws) => ({
    name: ws.station_name,
    utilization: Number(ws.utilization_percentage.toFixed(1)),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-3 h-3 rounded-full bg-teal inline-block" />
          <h3 className="text-sm font-semibold text-navy">Worker Utilization</h3>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={workerData} margin={{ top: 4, right: 8, left: -16, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E1E5EA" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-40}
              textAnchor="end"
              tick={{ fontSize: 11, fill: '#5A6B7C' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#5A6B7C' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(v: number) => [`${v}%`, 'Utilization']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E1E5EA', fontSize: 12 }}
            />
            <Bar dataKey="utilization" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {workerData.map((entry, i) => (
                <Cell key={i} fill={utilColor(entry.utilization)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-3 h-3 rounded-full bg-teal inline-block" />
          <h3 className="text-sm font-semibold text-navy">Workstation Utilization</h3>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={workstationData} margin={{ top: 4, right: 8, left: -16, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E1E5EA" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-40}
              textAnchor="end"
              tick={{ fontSize: 11, fill: '#5A6B7C' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#5A6B7C' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(v: number) => [`${v}%`, 'Utilization']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E1E5EA', fontSize: 12 }}
            />
            <Bar dataKey="utilization" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {workstationData.map((entry, i) => (
                <Cell key={i} fill={utilColor(entry.utilization)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
