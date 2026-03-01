'use client';

import { WorkerMetrics, WorkstationMetrics } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface ProductionChartProps {
  workers: WorkerMetrics[];
  workstations: WorkstationMetrics[];
}

export default function ProductionChart({
  workers,
  workstations,
}: ProductionChartProps) {
  const workerData = workers.map((w) => ({
    name: w.worker_name,
    unitsPerHour: Number(w.units_per_hour.toFixed(2)),
  }));

  const workstationData = workstations.map((ws) => ({
    name: ws.station_name,
    throughputRate: Number(ws.throughput_rate.toFixed(2)),
  }));

  const avgWorker =
    workerData.length > 0
      ? Number((workerData.reduce((s, d) => s + d.unitsPerHour, 0) / workerData.length).toFixed(2))
      : 0;

  const avgStation =
    workstationData.length > 0
      ? Number(
          (workstationData.reduce((s, d) => s + d.throughputRate, 0) / workstationData.length).toFixed(2)
        )
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-navy inline-block" />
            <h3 className="text-sm font-semibold text-navy">Worker Production Rate</h3>
          </div>
          <span className="text-xs text-ink-muted">avg {avgWorker} u/hr</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={workerData} margin={{ top: 4, right: 8, left: -16, bottom: 60 }}>
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
              tick={{ fontSize: 11, fill: '#5A6B7C' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: number) => [`${v}`, 'Units/Hour']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E1E5EA', fontSize: 12 }}
            />
            {avgWorker > 0 && (
              <ReferenceLine
                y={avgWorker}
                stroke="#E9C46A"
                strokeDasharray="4 3"
                label={{ value: 'avg', fill: '#E9C46A', fontSize: 10 }}
              />
            )}
            <Line
              type="monotone"
              dataKey="unitsPerHour"
              stroke="#1A2B3C"
              strokeWidth={2.5}
              dot={{ fill: '#1A2B3C', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#2A9D8F' }}
              name="Units/Hour"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-coral inline-block" />
            <h3 className="text-sm font-semibold text-navy">Workstation Throughput</h3>
          </div>
          <span className="text-xs text-ink-muted">avg {avgStation} u/hr</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={workstationData} margin={{ top: 4, right: 8, left: -16, bottom: 60 }}>
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
              tick={{ fontSize: 11, fill: '#5A6B7C' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: number) => [`${v}`, 'Throughput (u/hr)']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E1E5EA', fontSize: 12 }}
            />
            {avgStation > 0 && (
              <ReferenceLine
                y={avgStation}
                stroke="#E9C46A"
                strokeDasharray="4 3"
                label={{ value: 'avg', fill: '#E9C46A', fontSize: 10 }}
              />
            )}
            <Line
              type="monotone"
              dataKey="throughputRate"
              stroke="#E76F51"
              strokeWidth={2.5}
              dot={{ fill: '#E76F51', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#1A2B3C' }}
              name="Throughput (u/hr)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
