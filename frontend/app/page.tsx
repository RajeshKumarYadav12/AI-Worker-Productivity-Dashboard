import { Suspense } from 'react';
import {
  getFactoryMetrics,
  getWorkerMetrics,
  getWorkstationMetrics,
} from '@/lib/api';
import FilterableDashboard from '@/components/FilterableDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

export const dynamic = 'force-dynamic';

async function DashboardContent() {
  try {
    const [factoryMetrics, workerMetrics, workstationMetrics] =
      await Promise.all([
        getFactoryMetrics(),
        getWorkerMetrics(),
        getWorkstationMetrics(),
      ]);

    return (
      <FilterableDashboard
        factoryMetrics={factoryMetrics}
        allWorkerMetrics={workerMetrics}
        allWorkstationMetrics={workstationMetrics}
      />
    );
  } catch (error: any) {
    return (
      <ErrorDisplay
        message={
          error.message ||
          'Failed to load dashboard data. Please ensure the backend server is running.'
        }
      />
    );
  }
}

export default function HomePage() {
  return (
    <div>
      <div className="mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#1A2B3C' }}>
          Factory Overview
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: '#5A6B7C' }}>
          Monitor worker productivity and workstation performance in real-time
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
