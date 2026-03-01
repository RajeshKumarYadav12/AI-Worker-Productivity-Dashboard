'use client';

import { useState, useMemo } from 'react';
import { WorkerMetrics, WorkstationMetrics, FactoryMetrics } from '@/lib/types';
import FactorySummaryCards from '@/components/FactorySummaryCards';
import WorkerMetricsTable from '@/components/WorkerMetricsTable';
import WorkstationMetricsTable from '@/components/WorkstationMetricsTable';
import UtilizationChart from '@/components/UtilizationChart';
import ProductionChart from '@/components/ProductionChart';

interface Props {
  factoryMetrics: FactoryMetrics;
  allWorkerMetrics: WorkerMetrics[];
  allWorkstationMetrics: WorkstationMetrics[];
}

export default function FilterableDashboard({
  factoryMetrics,
  allWorkerMetrics,
  allWorkstationMetrics,
}: Props) {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [selectedStationId, setSelectedStationId] = useState<string>('');

  const filteredWorkers = useMemo(
    () =>
      selectedWorkerId
        ? allWorkerMetrics.filter((w) => w.worker_id === selectedWorkerId)
        : allWorkerMetrics,
    [selectedWorkerId, allWorkerMetrics]
  );

  const filteredStations = useMemo(
    () =>
      selectedStationId
        ? allWorkstationMetrics.filter((s) => s.station_id === selectedStationId)
        : allWorkstationMetrics,
    [selectedStationId, allWorkstationMetrics]
  );

  const hasFilter = selectedWorkerId || selectedStationId;

  const workerOptions = allWorkerMetrics.map((w) => ({
    value: w.worker_id,
    label: w.worker_name,
  }));

  const stationOptions = allWorkstationMetrics.map((s) => ({
    value: s.station_id,
    label: s.station_name,
  }));

  return (
    <div className="space-y-6">
      <FactorySummaryCards metrics={factoryMetrics} />

      <div
        style={{
          background: 'linear-gradient(135deg, #1A2B3C 0%, #1e3a4a 50%, #1a3840 100%)',
          borderRadius: 10,
          boxShadow: '0 4px 16px rgba(26,43,60,0.22)',
          overflow: 'hidden',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 p-3 sm:p-3.5">

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(42,157,143,0.18)',
                border: '1px solid rgba(42,157,143,0.45)',
                borderRadius: 7,
                padding: '5px 12px',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M1.5 3.5h13M4 8h8M6.5 12.5h3" stroke="#2A9D8F" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#2A9D8F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Filter
              </span>
            </div>

            {hasFilter && (
              <button
                onClick={() => { setSelectedWorkerId(''); setSelectedStationId(''); }}
                className="flex sm:hidden items-center gap-1.5"
                style={{
                  color: '#E76F51',
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'rgba(231,111,81,0.15)',
                  border: '1px solid rgba(231,111,81,0.4)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  padding: '5px 10px',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="#E76F51" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Clear
              </button>
            )}
          </div>

          <div className="hidden sm:block" style={{ width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.12)' }} aria-hidden="true" />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#E9C46A',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexShrink: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="8" cy="6" r="3" stroke="#E9C46A" strokeWidth="1.6"/>
                <path d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#E9C46A" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              Worker
            </span>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full sm:w-auto"
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  border: '1px solid rgba(233,196,106,0.4)',
                  borderRadius: 6,
                  padding: '7px 30px 7px 11px',
                  fontSize: 13,
                  fontWeight: selectedWorkerId ? 600 : 400,
                  color: selectedWorkerId ? '#1A2B3C' : '#8A9BAC',
                  backgroundColor: selectedWorkerId ? '#FDF6DC' : 'rgba(255,255,255,0.95)',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: 0,
                }}
              >
                <option value="">All Workers</option>
                {workerOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none', position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#8A9BAC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="hidden sm:block" style={{ width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.12)' }} aria-hidden="true" />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#8AB17D',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexShrink: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="2" y="6" width="16" height="11" rx="2" stroke="#8AB17D" strokeWidth="1.6"/>
                <path d="M6 6V5a4 4 0 018 0v1" stroke="#8AB17D" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              Workstation
            </span>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="w-full sm:w-auto"
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  border: '1px solid rgba(138,177,125,0.4)',
                  borderRadius: 6,
                  padding: '7px 30px 7px 11px',
                  fontSize: 13,
                  fontWeight: selectedStationId ? 600 : 400,
                  color: selectedStationId ? '#1A2B3C' : '#8A9BAC',
                  backgroundColor: selectedStationId ? '#EFF6EC' : 'rgba(255,255,255,0.95)',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: 0,
                }}
              >
                <option value="">All Workstations</option>
                {stationOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none', position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#8A9BAC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {hasFilter && (
            <>
              <div className="hidden sm:block" style={{ width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.12)' }} aria-hidden="true" />
              <button
                onClick={() => { setSelectedWorkerId(''); setSelectedStationId(''); }}
                className="hidden sm:flex items-center gap-1.5"
                style={{
                  color: '#E76F51',
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'rgba(231,111,81,0.15)',
                  border: '1px solid rgba(231,111,81,0.4)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  padding: '6px 12px',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="#E76F51" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Clear
              </button>
              <span className="hidden sm:inline" style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>
                {selectedWorkerId ? `1/${allWorkerMetrics.length} workers` : `all workers`}
                {' · '}
                {selectedStationId ? `1/${allWorkstationMetrics.length} stations` : `all stations`}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <UtilizationChart workers={filteredWorkers} workstations={filteredStations} />
        <ProductionChart workers={filteredWorkers} workstations={filteredStations} />
      </div>

      <WorkerMetricsTable workers={filteredWorkers} />
      <WorkstationMetricsTable workstations={filteredStations} />
    </div>
  );
}
