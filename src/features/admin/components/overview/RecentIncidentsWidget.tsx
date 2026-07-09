import type { Incident } from '../../types/admin.types';
import {
  TbActivity,
  TbHaze,
  TbLockOpen,
  TbFlame,
  TbShieldExclamation,
  TbUsersGroup,
  TbAmbulance,
} from 'react-icons/tb';
import type { ReactNode } from 'react';

interface Props {
  incidents: Incident[];
}

const INCIDENT_ICON: Record<string, ReactNode> = {
  SMOKE_DETECTION: <TbHaze size={16} />,
  THEFT_DETECTION: <TbLockOpen size={16} />,
  FIRE_DETECTION: <TbFlame size={16} />,
  WEAPON_DETECTION: <TbShieldExclamation size={16} />,
  CROWD_MANAGEMENT: <TbUsersGroup size={16} />,
  MEDICAL_EMERGENCY: <TbAmbulance size={16} />,
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'text-emerald-400 bg-emerald-400/10',
  RESOLVED: 'text-gray-400 bg-gray-400/10',
  PENDING: 'text-amber-400 bg-amber-400/10',
};

const STATUS_DOT: Record<string, string> = {
  ACTIVE: 'bg-emerald-400',
  RESOLVED: 'bg-gray-400',
  PENDING: 'bg-amber-400',
};

export default function RecentIncidentsWidget({
  incidents,
}: Props) {
  return (
    <div className="bg-[#0d1120] border border-white/5 rounded-xl p-4 sm:p-5">
      <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
        <TbActivity
          size={16}
          className="text-gray-500 flex-shrink-0"
        />
        <span>Recent Incidents</span>
      </h3>

      <div className="space-y-2">
        {incidents.slice(0, 5).map((inc) => (
          <div
            key={inc._id}
            className="flex items-center gap-3 py-2 min-w-0"
          >
            <span className="text-base flex-shrink-0">
              {INCIDENT_ICON[inc.type] ?? '⚠️'}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-200 truncate">
                {inc.incidentId}
              </p>

              <p className="text-xs text-gray-600 truncate">
                {inc.type.replace(/_/g, ' ')}
              </p>
            </div>

            {/* Desktop / Tablet Badge */}
            <span
              className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                STATUS_COLOR[inc.status]
              }`}
            >
              {inc.status}
            </span>

            {/* Mobile Status Dot */}
            <div
              className={`sm:hidden w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                STATUS_DOT[inc.status]
              }`}
            />
          </div>
        ))}

        {incidents.length === 0 && (
          <p className="text-xs text-gray-600 py-6 text-center">
            No incidents found
          </p>
        )}
      </div>
    </div>
  );
}