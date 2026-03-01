export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getUtilizationColor(utilization: number): string {
  if (utilization >= 80) return 'text-green-600';
  if (utilization >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function getStatusBadgeColor(utilization: number): string {
  if (utilization >= 80) return 'bg-green-100 text-green-800';
  if (utilization >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}
