import { BarChart } from "@mui/x-charts/BarChart";
import { useWeeklyTrend } from '../../../../../useWeeklyTrend';

const GREY = '#9CA3AF';

const getDayName = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
};

export default function WeeklyType() {
  const { data, isLoading, isError } = useWeeklyTrend();

  if (isLoading) return (
    <div style={{ height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: GREY, fontSize: 12 }}>Loading...</span>
    </div>
  );

  if (isError) return (
    <div style={{ height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#E05A5A', fontSize: 12 }}>{isError}</span>
    </div>
  );

  const dataset = data && data.length > 0 
    ? data.map((d: any) => ({
        day: d._id && d._id.includes('-') ? getDayName(d._id) : d._id, 
        low:    d.lowPriority || 0,
        medium: d.mediumPriority || 0,
        high:   d.highPriority || 0,
      }))
    : [];

  const hasData = data && data.length > 0 && data.some((d: any) => d.total > 0);

  if (!hasData) return (
    <div style={{ height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
      <span style={{ color: GREY, fontSize: 13 }}>No incidents this week</span>
      <span style={{ color: GREY, fontSize: 11, opacity: 0.6 }}>Data will appear when incidents are recorded</span>
    </div>
  );

  return (
    <div className="w-full h-full" style={{ display: 'flex', justifyContent: 'center', padding: '0px' }}>
      <BarChart
        dataset={dataset}
        height={230}
        width={420}
        xAxis={[{
          scaleType: 'band',
          dataKey: 'day',
          disableTicks: true,
          disableLine: true,
          tickLabelStyle: { fill: GREY, fontSize: 11 },
        }]}
        yAxis={[{
          disableTicks: true,
          disableLine: true,
          tickLabelStyle: { fill: GREY, fontSize: 11 },
        }]}
        series={[
          {
            dataKey: 'low',
            label: 'Low Priority',
            color: '#B4C3CC',
            valueFormatter: (v) => (v != null ? `${v}` : ''),
            stack: 'total',
          },
          {
            dataKey: 'medium',
            label: 'Medium Priority',
            color: '#E09A3D',
            valueFormatter: (v) => (v != null ? `${v}` : ''),
            stack: 'total',
          },
          {
            dataKey: 'high',
            label: 'High Priority',
            color: '#E05A5A',
            valueFormatter: (v) => (v != null ? `${v}` : ''),
            stack: 'total',
          },
        ]}
        borderRadius={6}
        slotProps={{
          legend: { sx: { display: 'none' } },
        }}
        margin={{ top: 15, right: 10, bottom: 25, left: 25 }}
        sx={{
          '& .MuiChartsAxis-tickLabel tspan': {
            fill: '#94A3B8 !important',
            fontSize: '11px',
          },
        }}
      />
    </div>
  );
}