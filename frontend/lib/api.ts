import {
  WorkerMetrics,
  WorkstationMetrics,
  FactoryMetrics,
  ApiResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Unknown API error');
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function getFactoryMetrics(): Promise<FactoryMetrics> {
  return fetchApi<FactoryMetrics>('/api/metrics/factory');
}

export async function getWorkerMetrics(
  workerId?: string
): Promise<WorkerMetrics[]> {
  const query = workerId ? `?worker_id=${workerId}` : '';
  return fetchApi<WorkerMetrics[]>(`/api/metrics/workers${query}`);
}

export async function getWorkstationMetrics(
  stationId?: string
): Promise<WorkstationMetrics[]> {
  const query = stationId ? `?workstation_id=${stationId}` : '';
  return fetchApi<WorkstationMetrics[]>(`/api/metrics/workstations${query}`);
}

export async function seedDatabase(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/seed`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to seed database');
  }
}
