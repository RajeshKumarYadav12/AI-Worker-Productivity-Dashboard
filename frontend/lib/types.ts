export interface WorkerMetrics {
  worker_id: string;
  worker_name: string;
  total_active_hours: number;
  total_idle_hours: number;
  utilization_percentage: number;
  total_units_produced: number;
  units_per_hour: number;
}

export interface WorkstationMetrics {
  station_id: string;
  station_name: string;
  occupancy_hours: number;
  utilization_percentage: number;
  total_units_produced: number;
  throughput_rate: number;
}

export interface FactoryMetrics {
  total_productive_hours: number;
  total_production_count: number;
  average_production_rate: number;
  average_utilization_percentage: number;
  total_workers: number;
  total_workstations: number;
  active_workers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
