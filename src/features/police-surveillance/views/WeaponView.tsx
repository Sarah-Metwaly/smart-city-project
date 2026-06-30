import React from 'react';
import StatCards from '../../../shared/ui/organisms/StatCards';
import DangerZonesMap from '../../../shared/ui/organisms/CitySurveillanceMap';
import { Activity, ShieldAlert, Siren, CheckCircle2 } from 'lucide-react';
import MonthlyCrimeChart from '../components/WeaponComponent/MonthlyCrimeChart';
import WeaponActiveAlerts from '../components/WeaponComponent/WeaponActiveAlerts';
import WeaponIncidents from '../components/WeaponComponent/WeaponTable';
import { useIncidents } from '../../../shared/hooks/useIncidentTable';
import LiveStream from '../../../shared/ui/organisms/CameraFeed';

const WeaponView: React.FC = () => {
  const { Incidents, isLoading, isError } = useIncidents(
    '/api/v1/incidents/DailyIncidents?type=WEAPON_DETECTION',
  );

  const total = Incidents?.length ?? 0;
  const high = Incidents?.filter((i) => i.priority === 'HIGH').length ?? 0;
  const active =
    Incidents?.filter((i) => i.status?.toUpperCase() === 'ACTIVE').length ?? 0;
  const resolved =
    Incidents?.filter((i) => i.status?.toUpperCase() === 'RESOLVED').length ??
    0;

  const weaponStats = [
    {
      title: 'Total Alerts',
      value: total,
      icon: Activity,
      badge: 'LIVE',
      colorClass: { bg: 'bg-aman-blue/10', text: 'text-[#38bdf8]' },
    },
    {
      title: 'Active Alerts',
      value: active,
      icon: ShieldAlert,
      badge: 'LIVE',
      colorClass: { bg: 'bg-aman-red/10', text: 'text-[#ff4d4d]' },
    },
    {
      title: 'Emergency Alerts',
      value: high,
      icon: Siren, //
      badge: 'HIGH',
      colorClass: { bg: 'bg-amber-500/10', text: 'text-[#fbbf24]' },
    },
    {
      title: 'Resolved Alerts',
      value: resolved,
      icon: CheckCircle2,
      badge: 'CLEARED',
      colorClass: { bg: 'bg-aman-green/10', text: 'text-[#4caf8a]' },
    },
  ];
  return (
    <div className="flex flex-col min-h-screen gap-6 py-5 font-mono text-aman-white sm:px-6 lg:px-4">
      {/* 1. TOP STATS CARDS */}
      <StatCards stats={weaponStats} />

      {/* 2. PRIMARY UNIT: CAMERA FEED & ALERTS SIDE-BY-SIDE */}
      <div className="grid h-full gap-2 lg:grid-cols-12">
        {/* Live Camera Feed */}
        <div className="col-span-12 md:col-span-9">
          <LiveStream />
        </div>
        {/* Live Alerts (Match Queue) */}
        <div className="col-span-12 md:col-span-3">
          <WeaponActiveAlerts />
        </div>
      </div>

      {/* 3. SECONDARY UNIT: MAP & CRIME RATE CHART SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* City Map */}
        <div className="overflow-hidden border shadow-lg border-aman-teal/20 rounded-2xl bg-aman-teal h-100">
          <div className="relative h-full">
      <DangerZonesMap filterType="WEAPON_DETECTION" />
          </div>
        </div>

        {/* Monthly Crime Rate Chart - */}
        <div className="overflow-hidden border shadow-lg border-aman-teal/20 rounded-2xl bg-aman-dark/40 h-100">
          <MonthlyCrimeChart />
        </div>
      </div>

      {/* 4. INCIDENT LOGS */}

      <div className="flex-1 overflow-y-auto">
        <WeaponIncidents />
      </div>
    </div>
  );
};

export default WeaponView;
