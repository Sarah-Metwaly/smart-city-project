import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Incident } from '../../types/incident';

interface AlertsDropdownProps {
  incidents: Incident[];
}

const PRIORITY_STYLES: Record<string, { textClass: string; bg: string; border: string }> = {
  HIGH:   { textClass: 'text-aman-danger',  bg: 'bg-aman-danger/10',  border: 'border-aman-danger/30' },
  MEDIUM: { textClass: 'text-aman-warning', bg: 'bg-aman-warning/10', border: 'border-aman-warning/30' },
  LOW:    { textClass: 'text-aman-success', bg: 'bg-aman-success/10', border: 'border-aman-success/30' },
};

const AlertsDropdown: React.FC<AlertsDropdownProps> = ({ incidents }) => {
  const navigate = useNavigate();

  const getTargetPath = (type: Incident['type']): string => {
    if (type === 'FIRE_DETECTION' || type === 'SMOKE_DETECTION') return '/fire';
    if (type === 'WEAPON_DETECTION') return '/police?view=weapon';
    if (
      type === 'CROWD_MANAGEMENT' ||
      type === 'THEFT_DETECTION' ||
      type === 'BEHAVIOR_ANOMALY'
    ) return '/police?view=behavior';
    return '/police?view=LiveEvents';
  };

  return (
    <div
      className="absolute right-0 mt-2 w-80 z-50 overflow-hidden rounded-sm border border-aman-teal bg-aman-dark animate-dropdown-in"
      style={{ transformOrigin: 'top right' }}
    >
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-aman-teal bg-aman-teal/20">
        <span className="font-montserrat text-[11px] tracking-[1.5px] text-aman-light">
          LIVE ALERTS
        </span>
        <span className="font-dm-mono text-[11px] text-aman-white bg-aman-teal border border-aman-blue/40 rounded-sm px-2 py-0.5">
          {incidents.length}
        </span>
      </div>

      <ul className="max-h-72 overflow-y-auto">
        {incidents.length === 0 && (
          <li className="px-3.5 py-4 text-center text-xs text-aman-blue font-inter">
            No active alerts
          </li>
        )}

        {incidents.map((incident, index) => {
          const style = PRIORITY_STYLES[incident.priority] || PRIORITY_STYLES.LOW;
          const zoneName = incident.location?.zone || incident.location?.name || 'unknown';
          const isHigh = incident.priority === 'HIGH';

          return (
            <li
              key={incident._id}
              onClick={() => navigate(getTargetPath(incident.type))}
              className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer border-b border-aman-teal/40 hover:bg-aman-teal/20 transition-colors duration-150 animate-slide-in ${
                isHigh ? 'animate-pulse-danger' : ''
              }`}
              style={{
                borderLeft: `2px solid var(--color-aman-${incident.priority === 'HIGH' ? 'danger' : incident.priority === 'MEDIUM' ? 'warning' : 'success'})`,
                borderRadius: 0,
                animationDelay: `${index * 40}ms`,
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-inter text-xs text-aman-white tracking-wide">
                  {incident.type}{' '}
                  <span className="text-aman-blue">({zoneName})</span>
                </span>
                <span className="font-dm-mono text-[10px] text-aman-blue/70">
                  {new Date(incident.createdAt).toLocaleTimeString('en-GB')}
                </span>
              </div>
              <span
                className={`font-inter text-[10px] font-medium tracking-wide rounded-sm px-2 py-0.5 border ${style.textClass} ${style.bg} ${style.border}`}
              >
                {incident.priority}
              </span>
            </li>
          );
        })}
      </ul>

      <div
        onClick={() => navigate('/police')}
        className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 cursor-pointer border-t border-aman-teal bg-aman-teal/20 hover:bg-aman-teal/30 transition-colors duration-150"
      >
        <span className="font-inter text-[11px] text-aman-light tracking-wide">
          View police dashboard
        </span>
      </div>
    </div>
  );
};

export default AlertsDropdown;