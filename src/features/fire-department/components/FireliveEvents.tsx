import React, { useState } from 'react';
import StatCards from '../../../shared/ui/organisms/StatCards';
import { Flame, Thermometer, Wind, AlertCircle } from 'lucide-react';
import CameraFeed from '../../../shared/ui/organisms/CameraFeed';
import FireAlertsPage from './FireActiveAlerts';
import { Sensors } from './Sensors';
import { useActivePower } from '../../energy-optimization/hooks/useActivePower';
import { useFlameSensor } from '../hooks/useFlame';
import { useIncidents } from '../../../shared/hooks/useIncidentTable';
import LiveStream from '../../../shared/ui/organisms/LiveStream';









const FireLiveEvents: React.FC = () => {
  const { DHT11Value } = useActivePower();
  const { flameSensorData, isFlameDetected } = useFlameSensor();

  const { Incidents } = useIncidents("/api/v1/incidents/DailyIncidents?type=FIRE_DETECTION");


  const high = Incidents?.filter((i) => i.priority === "HIGH").length ?? 0;
  const active = Incidents?.filter((i) => i.status?.toUpperCase() === "ACTIVE").length ?? 0;




  const surveillanceStats = [
    {
      title: 'Critical Alerts',
      value: high,
      icon: Flame,
      badge: 'CRITICAL',
      colorClass: {
        text: 'text-red-500',
        bg: 'bg-red-600',
      },
    },
    {
      title: 'Thermal Level',
      value: `${DHT11Value?.temperature ?? 0}°C`,
      icon: Thermometer,
      badge: 'Temperature',
      colorClass: {
        text: 'text-orange-500',
        bg: 'bg-orange-600',
      },
    },
    {
      title: 'Flame detection',
      value: flameSensorData?.status,
      icon: Wind,
      badge: flameSensorData?.risk_level,
      colorClass: {
        text: 'text-amber-500',
        bg: 'bg-amber-600',
      },
    },
    {
      title: 'Active alerts',
      value: active,
      icon: AlertCircle,
      badge: 'URGENT',
      colorClass: {
        text: 'text-yellow-500',
        bg: 'bg-yellow-600',
      },
    },

  ];
  return (
    <>
      <div className="flex flex-col gap-6 py-5 font-mono text-aman-white sm:px-6 ">
        {/* 1.Cards */}
        <StatCards stats={surveillanceStats} />
        <div className="grid grid-cols-12 gap-4">
          {/* 2. (Main Screen) */}
          <div className=" col-span-12 md:col-span-8 relative bg-aman-teal border border-aman-teal rounded-2xl overflow-hidden shadow-[0_0_24px_rgba(30,58,70,0.45)] h-[350px] md:h-[400px]">
           <LiveStream streamUrl="http://20.233.89.255:8888/camera/index.m3u8" />
           </div>
          <div className="col-span-12 md:col-span-4">
            <FireAlertsPage />
          </div>
        </div>
     

      {/***SensorsOverview*** */}
     <div className="w-full">
          <Sensors />
        </div>
      </div>

     </>
  );
};

export default FireLiveEvents;
