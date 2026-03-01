import { FactoryMetrics } from '@/lib/types';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface Props { metrics: FactoryMetrics; }


const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 6v4.5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 7l7-4 7 4v6l-7 4-7-4V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 3v14M3 7l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconTrendUp = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 14l5-5 4 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 5h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconGauge = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.1 13.9A8 8 0 1115.9 13.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 10l-2.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 9a3 3 0 010-6M17.5 17c0-2.8-1.6-5.2-3.9-6.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconGrid = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const CARD_ACCENTS = [
  { bg: '#D1EFEC', fg: '#1F7A70' },
  { bg: '#DDEAF8', fg: '#1A2B3C' },
  { bg: '#E2EFE0', fg: '#6E9261' },
  { bg: '#D1EFEC', fg: '#1F7A70' },
  { bg: '#E2EFE0', fg: '#6E9261' },
  { bg: '#DDEAF8', fg: '#1A2B3C' },
];

export default function FactorySummaryCards({ metrics }: Props) {
  const cards = [
    {
      title: 'Productive Hours',
      value: formatNumber(metrics.total_productive_hours),
      unit: 'hrs',
      Icon: IconClock,
    },
    {
      title: 'Total Production',
      value: metrics.total_production_count.toLocaleString(),
      unit: 'units',
      Icon: IconBox,
    },
    {
      title: 'Avg Production Rate',
      value: formatNumber(metrics.average_production_rate),
      unit: 'units / hr',
      Icon: IconTrendUp,
    },
    {
      title: 'Avg Utilization',
      value: formatPercentage(metrics.average_utilization_percentage),
      unit: '',
      Icon: IconGauge,
    },
    {
      title: 'Active Workers',
      value: `${metrics.active_workers} / ${metrics.total_workers}`,
      unit: '',
      Icon: IconUsers,
    },
    {
      title: 'Workstations',
      value: metrics.total_workstations.toString(),
      unit: '',
      Icon: IconGrid,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const accent = CARD_ACCENTS[i];
        return (
          <div
            key={card.title}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E1E5EA',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(26,43,60,0.07)',
              transition: 'box-shadow 0.15s',
            }}
            className="p-4 flex flex-col gap-3 hover:shadow-card-hover"
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: accent.bg,
                color: accent.fg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <card.Icon />
            </div>

            <div>
              <p
                className="text-2xl font-bold leading-tight"
                style={{ color: '#1A2B3C' }}
              >
                {card.value}
                {card.unit && (
                  <span
                    className="text-sm font-normal ml-1"
                    style={{ color: '#5A6B7C' }}
                  >
                    {card.unit}
                  </span>
                )}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#8A9BAC' }}>
                {card.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
