import { Thermometer } from 'lucide-react';
import { useActivePower } from '../../energy-optimization/hooks/useActivePower';


interface Reading {
  label: string;
  value: string;
  percent: number; // 0-100, for the bar width
  barClassName: string;
}

const MOCK_READINGS: Reading[] = [
  { label: 'TEMPERATURE', value: '32°C', percent: 64, barClassName: 'bg-amber-500' },
  { label: 'AIR QUALITY', value: 'AQI 42', percent: 42, barClassName: 'bg-emerald-400' },
  { label: 'HUMIDITY', value: '58%', percent: 58, barClassName: 'bg-aman-blue' },
  { label: 'Smoke', value: '12 ', percent: 30, barClassName: 'bg-aman-blue' },
];

export function EnvironmentalPanel() {

  return (
    <div className="h-full flex flex-col rounded-xl border border-aman-teal bg-aman-dark px-4 py-3.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6.5 w-6.5 rounded-md bg-aman-teal flex items-center justify-center">
            <Thermometer className="h-3.5 w-3.5 text-aman-light" />
          </div>
          <span className="text-[13px] font-medium tracking-wide text-aman-white">
            ENVIRONMENTAL
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] tracking-wider text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          NORMAL
        </span>
      </div>

      {/* Readings — fixed gap (not justify-between) so rows stay compact
          and don't get spread toward the bottom edge on shorter viewports;
          flex-1 + min-h-0 + overflow-y-auto scrolls internally as a
          fallback if it still doesn't fit. */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0">
        {MOCK_READINGS.map((reading) => (
          <ReadingRow key={reading.label} reading={reading} />
        ))}
      </div>
    </div>
  );
}

function ReadingRow({ reading }: { reading: Reading }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] tracking-wide text-aman-light">{reading.label}</span>
        <span className="text-[13px] font-medium text-amber-500">{reading.value}</span>
      </div>
      <div className="h-1 rounded-full bg-aman-teal overflow-hidden">
        <div
          className={`h-full rounded-full ${reading.barClassName}`}
          style={{ width: `${reading.percent}%` }}
        />
      </div>
    </div>
  );
}