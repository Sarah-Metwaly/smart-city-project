import { BarChart } from "@mui/x-charts/BarChart";

const rawData = [
  { day: "MON", value: 8 },
  { day: "TUE", value: 14 },
  { day: "WED", value: 6 },
  { day: "THU", value: 18 },
  { day: "FRI", value: 11 },
  { day: "SAT", value: 16 },
  { day: "SUN", value: 12 },
];

const dataset = rawData.map(({ day, value }) => ({
  day,
  low: value < 10 ? value : null,
  medium: value >= 10 && value <= 15 ? value : null,
  high: value > 15 ? value : null,
}));

export default function IncidentChart() {
  return (
    <div className="h-full w-full">
      <BarChart
        dataset={dataset}
        height={200}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "day",
            disableTicks: true,
            disableLine: true,
          },
        ]}
        yAxis={[
          {
            disableTicks: true,
            disableLine: true,
          },
        ]}
        series={[
          {
            dataKey: "low",
            label: "Low",
            color: "#B4C3CC",
            valueFormatter: (v) => (v != null ? `${v}` : ""),
            stack: "total",
          },
          {
            dataKey: "medium",
            label: "Medium",
            color: "#E09A3D",
            valueFormatter: (v) => (v != null ? `${v}` : ""),
            stack: "total",
          },
          {
            dataKey: "high",
            label: "High",
            color: "#E05A5A",
            valueFormatter: (v) => (v != null ? `${v}` : ""),
            stack: "total",
          },
        ]}
        borderRadius={8}
        slotProps={{
          legend: { hidden: true },
        }}
        sx={{
  "& .MuiChartsAxis-tickLabel tspan": {
    fill: "#94A3B8 !important",
    fontSize: "12px",
  },
}}
      />
    </div>
  );
}
