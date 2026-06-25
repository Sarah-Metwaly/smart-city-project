import React, { useState } from 'react';
import StatCards from '../../../shared/ui/organisms/StatCards';
import { Flame, Thermometer, Wind, AlertCircle } from 'lucide-react';
import CameraFeed from '../../../shared/ui/organisms/CameraFeed';
import FireAlertsPage from './FireActiveAlerts';
import { Sensors } from './Sensors';





const FireLiveEvents: React.FC = () => {
   
  const surveillanceStats = [
    {
      title: 'Critical Heat Zones',
      value: '04',
      icon: Flame,
      badge: 'CRITICAL',
      colorClass: {
        text: 'text-red-500',
        bg: 'bg-red-600',
      },
    },
    {
      title: 'Thermal Level',
      value: '92°C',
      icon: Thermometer,
      badge: 'DANGER',
      colorClass: {
        text: 'text-orange-500',
        bg: 'bg-orange-600',
      },
    },
    {
      title: 'Air Toxicity',
      value: 'High',
      icon: Wind,
      badge: 'SMOKE',
      colorClass: {
        text: 'text-amber-500',
        bg: 'bg-amber-600',
      },
    },
    {
      title: 'Evacuation Plan',
      value: 'Active',
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
        {/* 2. MASTER FEED (Main Screen) */}
        <div className="relative rounded-2xl overflow-hidden shadow-[0_0_24px_rgba(30,58,70,0.45)]flex gap-2 grid grid-cols-12">
          <div className="h-100 ">
            <CameraFeed location="Main Square - Gate 4" status="PROCESSING" />
          </div>
        </div>
        {/***Activealerts + SensorsOverview*** */}
        <div className="grid grid-cols-12 gap-7 ">
          <div className="col-span-8 flex-col justify-">
            <Sensors/>

          </div>
          <div className="col-span-3">
          <FireAlertsPage/>
          </div>
          
        </div>
          
        </div>
    </>
  );
};

export default FireLiveEvents;
