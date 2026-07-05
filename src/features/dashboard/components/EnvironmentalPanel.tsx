// import { Thermometer } from 'lucide-react';
// import { useAirQuality } from '../../air-quality/hooks/useAirQuality'; 
// import {
//   getCoStatus,
//   getCo2Status,
//   getHumidityStatus,
//   getPressureStatus,
//   getAQIColor,
//   getAQIMarkerLeft,
// } from '../../air-quality/helpers'; 

// const statusColor: Record<string, string> = {
//   normal: 'bg-emerald-400',
//   warning: 'bg-amber-500',
//   danger: 'bg-red-500',
//   stable: 'bg-aman-blue',
// };

// const statusTextColor: Record<string, string> = {
//   normal: 'text-emerald-400',
//   warning: 'text-amber-500',
//   danger: 'text-red-500',
//   stable: 'text-aman-blue',
// };

// interface Reading {
//   label: string;
//   value: string;
//   percent: number;
//   barClassName: string;
// }

// export function EnvironmentalPanel() {
//   const { data, isLoading, isError } = useAirQuality();

//   const overallStatus = data ? getCoStatus(data.mq135.co) : 'normal';
//   // ملحوظة: ده أسوأ حالة موجودة، مش بس الـ CO — شوف التعليق تحت

//   const readings: Reading[] = data
//     ? [
//         {
//           label: 'TEMPERATURE',
//           value: `${data.dht11.temperature}°C`,
//           percent: Math.min(100, Math.max(0, (data.dht11.temperature / 50) * 100)),
//           barClassName: statusColor.normal, // مفيش عندنا getTemperatureStatus جاهزة
//         },
//         {
//           label: 'AIR QUALITY',
//           value: `AQI ${data.mq135.aqi}`,
//           percent: parseFloat(getAQIMarkerLeft(data.mq135.aqi)),
//           barClassName: '', // هيتحدد بالـ inline style تحت باستخدام getAQIColor
//           aqiColor: getAQIColor(data.mq135.aqi),
//         } as Reading & { aqiColor: string },
//         {
//           label: 'HUMIDITY',
//           value: `${data.dht11.humidity}%`,
//           percent: data.dht11.humidity,
//           barClassName: statusColor[getHumidityStatus(data.dht11.humidity)],
//         },
//         {
//           label: 'CO2',
//           value: `${data.mq135.co2} ppm`,
//           percent: Math.min(100, (data.mq135.co2 / 2000) * 100),
//           barClassName: statusColor[getCo2Status(data.mq135.co2)],
//         },
//       ]
//     : [];

//   const statusLabel = overallStatus.toUpperCase();

//   return (
//     <div className="h-full flex flex-col rounded-xl border border-aman-teal bg-aman-dark px-4 py-3.5 overflow-hidden">
//       <div className="flex items-center justify-between mb-3 shrink-0">
//         <div className="flex items-center gap-2">
//           <div className="h-6.5 w-6.5 rounded-md bg-aman-teal flex items-center justify-center">
//             <Thermometer className="h-3.5 w-3.5 text-aman-light" />
//           </div>
//           <span className="text-[13px] font-medium tracking-wide text-aman-white">
//             ENVIRONMENTAL
//           </span>
//         </div>
//         <span className={`flex items-center gap-1.5 text-[11px] tracking-wider ${statusTextColor[overallStatus] ?? 'text-emerald-400'}`}>
//           <span className={`h-1.5 w-1.5 rounded-full ${statusColor[overallStatus] ?? 'bg-emerald-400'}`} />
//           {statusLabel}
//         </span>
//       </div>

//       {isLoading && <p className="text-[12px] text-aman-blue">Loading...</p>}
//       {isError && <p className="text-[12px] text-red-500">Failed to load environmental data.</p>}

//       {!isLoading && !isError && (
//         <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0">
//           {readings.map((reading) => (
//             <ReadingRow key={reading.label} reading={reading} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function ReadingRow({ reading }: { reading: Reading & { aqiColor?: string } }) {
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-1">
//         <span className="text-[11px] tracking-wide text-aman-light">{reading.label}</span>
//         <span className="text-[13px] font-medium text-amber-500">{reading.value}</span>
//       </div>
//       <div className="h-1 rounded-full bg-aman-teal overflow-hidden">
//         <div
//           className={`h-full rounded-full ${reading.barClassName}`}
//           style={reading.aqiColor ? { width: `${reading.percent}%`, backgroundColor: reading.aqiColor } : { width: `${reading.percent}%` }}
//         />
//       </div>
//     </div>
//   );
// }




import { Thermometer } from 'lucide-react';
import { useAirQuality } from '../../air-quality/hooks/useAirQuality';
import {
  getCoStatus,
  getCo2Status,
  getHumidityStatus,
  getPressureStatus,
  getAQIColor,
  getAQIMarkerLeft,
} from '../../air-quality/helpers';
import type { AQStatus } from '../../air-quality/types/airQuality';

const statusColor: Record<string, string> = {
  normal: 'bg-emerald-400',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  stable: 'bg-aman-blue',
};

const statusTextColor: Record<string, string> = {
  normal: 'text-emerald-400',
  warning: 'text-amber-500',
  danger: 'text-red-500',
  stable: 'text-aman-blue',
};

const STATUS_PRIORITY: Record<AQStatus, number> = {
  danger: 3,
  warning: 2,
  stable: 1,
  normal: 0,
};

function worstStatus(statuses: AQStatus[]): AQStatus {
  return statuses.reduce((worst, s) =>
    STATUS_PRIORITY[s] > STATUS_PRIORITY[worst] ? s : worst
  , 'normal' as AQStatus);
}

interface Reading {
  label: string;
  value: string;
  percent: number;
  barClassName: string;
  aqiColor?: string;
}

export function EnvironmentalPanel() {
  const { data, isLoading } = useAirQuality();

  const hasFullData = !!data?.mq135 && !!data?.bmp180 && !!data?.dht11;
  const showError = !hasFullData && !isLoading;

  const overallStatus: AQStatus = hasFullData
    ? worstStatus([
        getCoStatus(data!.mq135.co),
        getCo2Status(data!.mq135.co2),
        getHumidityStatus(data!.dht11.humidity),
        getPressureStatus(data!.bmp180.pressure),
      ])
    : 'normal';

  const readings: Reading[] = hasFullData
    ? [
        {
          label: 'TEMPERATURE',
          value: `${data!.dht11.temperature}°C`,
          percent: Math.min(100, Math.max(0, (data!.dht11.temperature / 50) * 100)),
          barClassName: statusColor.normal,
        },
        {
          label: 'AIR QUALITY',
          value: `AQI ${data!.mq135.aqi}`,
          percent: parseFloat(getAQIMarkerLeft(data!.mq135.aqi)),
          barClassName: '',
          aqiColor: getAQIColor(data!.mq135.aqi),
        },
        {
          label: 'HUMIDITY',
          value: `${data!.dht11.humidity}%`,
          percent: data!.dht11.humidity,
          barClassName: statusColor[getHumidityStatus(data!.dht11.humidity)],
        },
        {
          label: 'CO2',
          value: `${data!.mq135.co2} ppm`,
          percent: Math.min(100, (data!.mq135.co2 / 2000) * 100),
          barClassName: statusColor[getCo2Status(data!.mq135.co2)],
        },
      ]
    : [];

  const statusLabel = overallStatus.toUpperCase();

  return (
    <div className="h-full flex flex-col rounded-xl border border-aman-teal bg-aman-dark px-4 py-3.5 overflow-hidden">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6.5 w-6.5 rounded-md bg-aman-teal flex items-center justify-center">
            <Thermometer className="h-3.5 w-3.5 text-aman-light" />
          </div>
          <span className="text-[13px] font-medium tracking-wide text-aman-white">
            ENVIRONMENTAL
          </span>
        </div>
        <span
          className={`flex items-center gap-1.5 text-[11px] tracking-wider ${
            statusTextColor[overallStatus] ?? 'text-emerald-400'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusColor[overallStatus] ?? 'bg-emerald-400'}`} />
          {statusLabel}
        </span>
      </div>

      {isLoading && <p className="text-[12px] text-aman-blue">Loading...</p>}
      {showError && <p className="text-[12px] text-red-500">Failed to load environmental data.</p>}

      {!isLoading && !showError && (
        // grid بدل flex+scroll — كل reading بياخد مساحة متساوية، مفيش scrollbar خالص
        <div className="flex-1 min-h-0 grid grid-rows-4 gap-2.5">
          {readings.map((reading) => (
            <ReadingRow key={reading.label} reading={reading} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReadingRow({ reading }: { reading: Reading }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] tracking-wide text-aman-light">{reading.label}</span>
        <span className="text-[13px] font-medium text-amber-500">{reading.value}</span>
      </div>
      <div className="h-1 rounded-full bg-aman-teal overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${reading.barClassName}`}
          style={
            reading.aqiColor
              ? { width: `${reading.percent}%`, backgroundColor: reading.aqiColor }
              : { width: `${reading.percent}%` }
          }
        />
      </div>
    </div>
  );
}