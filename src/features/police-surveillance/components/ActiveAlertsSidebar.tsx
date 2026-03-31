import React from 'react';
import AlertItem from './AlertItem';

type AlertStatus = 'active' | 'dispatched' | 'resolved';

interface Alert {
  id: string;
  time: string;
  cam: string;
  loc: string;
  type: string;
  conf: number;
  status: AlertStatus;
}

const ALERTS_DATA: Alert[] = [
  { id: "WPN-001", time: "14:35", cam: "CAM-02", loc: "October Bridge", type: "Bladed Weapon", conf: 94, status: "active" },
  { id: "WPN-002", time: "14:20", cam: "CAM-07", loc: "Shubra El-Kheima", type: "Firearm", conf: 87, status: "dispatched" },
  { id: "WPN-003", time: "13:55", cam: "CAM-12", loc: "Maadi", type: "Bladed Weapon", conf: 91, status: "resolved" },
  { id: "WPN-004", time: "13:30", cam: "CAM-05", loc: "Helwan", type: "Suspicious Package", conf: 78, status: "dispatched" },
  { id: "WPN-005", time: "13:10", cam: "CAM-09", loc: "Ain Shams", type: "Bladed Weapon", conf: 82, status: "resolved" },
  { id: "EVT-006", time: "12:45", cam: "CAM-03", loc: "Nasr City", type: "Person Detected", conf: 96, status: "active" },
];

const ActiveAlertsSidebar: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto divide-y divide-aman-teal/50 bg-aman-teal custom-scrollbar">
      {ALERTS_DATA.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

export default ActiveAlertsSidebar;