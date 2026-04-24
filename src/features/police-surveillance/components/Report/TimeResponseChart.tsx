import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const pData = [12, 18, 15, 25, 20, 28, 22];
const xLabels = ['12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];

function CustomMark(props: any) {
  const { x, y, color, dataIndex } = props;

  return (
    <g>
      {/* point */}
      <circle cx={x} cy={y} r={5} fill={color || '#E05A5A'} />
    </g>
  );
}

export default function TimeResponseChart() {
  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
    
      
      <LineChart
        series={[
          { 
            data: pData, 
            showMark: true,
            color: '#E05A5A', 
            curve: "linear",
            
          }
        ]}
        xAxis={[{ 
            scaleType: 'point', 
            data: xLabels,
            disableLine: true,
            disableTicks: true,
        }]}
        yAxis={[{
            disableLine: true,
            disableTicks: true,
        }]}
        
        slots={{
          mark: CustomMark,
        }}
       sx={{
  "& .MuiChartsAxis-tickLabel": {
    fill: "#94A3B8 !important"  ,
    fontSize: "12px",
    fontWeight: "bold",
  },
}}
        height={200}
      />
    </Box>
  );
}