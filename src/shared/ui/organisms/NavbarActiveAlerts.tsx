import React, { useState, useRef, useEffect } from 'react';
import { HiBell } from 'react-icons/hi';
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
        className="relative p-2 hover:text-white"
      >
        <HiBell size={22} className="text-yellow-400" />
        {hasActiveAlert && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {priorityIncidents.length}
          </span>
        )}
      </button>

      {open && <AlertsDropdown incidents={priorityIncidents} />}
    </div>
  );
};

export default NavbarActiveAlerts;