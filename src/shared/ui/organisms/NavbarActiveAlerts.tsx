import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useHighestPriorityIncident } from '../../hooks/useHighestPriorityIncident';
import AlertsDropdown from '../molecules/AlertsDropdown';

const NavbarActiveAlerts: React.FC = () => {
  const { priorityIncidents, hasActiveAlert } = useHighestPriorityIncident();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2.5 rounded-full border border-teal-500/20 bg-slate-800/40 backdrop-blur-sm text-slate-300 hover:text-teal-300 hover:border-teal-400/40 hover:bg-slate-800/70 transition-all duration-200"
      >
        <Bell size={20} strokeWidth={1.75} />

        {hasActiveAlert && (
          <>
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500/60 animate-ping" />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold leading-none text-white ring-2 ring-slate-900">
              {priorityIncidents.length}
            </span>
          </>
        )}
      </button>

      {open && <AlertsDropdown incidents={priorityIncidents} />}
    </div>
  );
};

export default NavbarActiveAlerts;