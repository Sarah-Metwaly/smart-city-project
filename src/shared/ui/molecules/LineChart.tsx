import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';

interface LineChartProps {
  data: { label: string; value: number }[]; 
  title: string;                             
  color?: string;                           
}

const LineChart = ({ data, title, color }: LineChartProps) => {
  return (
    <div style={{ width: '100%', minHeight: '390px' }}>
      <MuiBarChart
        dataset={data}
        xAxis={[{ 
          scaleType: 'band', 
          dataKey: 'label',
          tickLabelStyle: { fill: '#B4C3CC', fontSize: 10 },
        }]}
        yAxis={[{
          tickLabelStyle: { fill: '#B4C3CC', fontSize: 10 },
         label: 'KWH',
          labelStyle: {
            fill: '#B4C3CC',
            fontSize: 10,
            transform: 'translate(30px, 165px)'
          }
        }]}
        series={[{ 
          dataKey: 'value', 
          label: title, 
          color: color,
        }]}
        // 1. تفعيل الخطوط بالطول وبالعرض معاً
        grid={{ horizontal: true, vertical: true }} 
        height={380}
        width={350}
        margin={{ left: 0, right: 35, top: 10, bottom: 0 }}
        slotProps={{ legend: { hidden: true } }}
        sx={{
         
          "& .MuiChartsGrid-line": {
            stroke: "#B4C3CC",
            strokeOpacity: 0.1, 
            strokeWidth: 1,    
          },
          
          "& .MuiChartsAxis-line": { display: 'none' },
          "& .MuiChartsAxis-tick": { display: 'none' },
        }}
      />
    </div>
  );
}

export default LineChart;