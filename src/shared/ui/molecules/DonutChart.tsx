import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';

// --- Types ---
interface ChartSlice {
  id: number;
  value: number;
  label: string;
  color: string;
}

interface DonutChartProps {
  data: ChartSlice[];
  total?: number;         // لو مش موجود بيحسبها تلقائي
  totalLabel?: string;    // النص تحت الرقم، default "TOTAL"
  width?: number;
  height?: number;
}

// --- Styled center text ---
const CenterText = styled('text')(() => ({
  fill: '#94A3B8',
  textAnchor: 'middle',
  dominantBaseline: 'central',
}));

// --- Component ---
export default function DonutChart({
  data,
  total,
  totalLabel = 'TOTAL',
  width = 300,
  height = 250,
}: DonutChartProps) {
  const cx = width / 2;
  const cy = 125; // matches PieChart's default cy anchor
  const computedTotal = total ?? data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Chart */}
      <PieChart
        series={[{
          data,
          innerRadius: 60,
          outerRadius: 100,
          cx,
          cy,
          startAngle: -90,
          endAngle: 270,
        }]}
        width={width}
        height={height}
        slotProps={{ legend: { hidden: true } }}
      >
        <CenterText x={cx} y={cy - 8} fontSize={22} fontWeight="bold" fill="#e2e8f0">
          {computedTotal}
        </CenterText>
        <CenterText x={cx} y={cy + 14} fontSize={10} letterSpacing={2}>
          {totalLabel}
        </CenterText>
      </PieChart>

      {/* Bottom Labels */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((slice) => (
          <div key={slice.id} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-[11px] text-slate-400">{slice.label}</span>
            <span className="text-[11px] font-semibold text-slate-200">{slice.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}