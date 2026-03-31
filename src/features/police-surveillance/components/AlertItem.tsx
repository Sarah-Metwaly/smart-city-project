import React from 'react';
import { Crosshair } from 'lucide-react';

type AlertStatus = 'active' | 'dispatched' | 'resolved';

interface Alert {
  type: string;
  status: AlertStatus;
  loc: string;
  conf: number | string;
  cam: string;
  time: string;
}

interface AlertItemProps {
  alert: Alert;
}

const STATUS_CLS: Record<AlertStatus, string> = {
  active: "text-[#ff4d4d] bg-[#ff4d4d]/10 border-[#ff4d4d]/20",
  dispatched: "text-[#7ecfcf] bg-[#7ecfcf]/10 border-[#7ecfcf]/20",
  resolved: "text-aman-gray bg-aman-gray/10 border-aman-gray/20"
};

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  return (
    <div className="bg-aman-dark flex items-center gap-3 px-3.5 py-2.5 transition-colors duration-150 hover:bg-aman-teal/35 cursor-pointer group">
      
      <div className="flex items-center justify-center border rounded-lg w-9 h-9 shrink-0 bg-aman-red/10 border-aman-red/22 group-hover:border-aman-red/50">
        <Crosshair className="w-3.5 h-3.5 text-aman-red" strokeWidth={1.7} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12px] font-semibold text-aman-white">{alert.type}</span>
          <span className={`text-[8px] font-bold tracking-[0.8px] px-1.5 py-0.5 rounded-full uppercase border ${STATUS_CLS[alert.status]}`}>
            {alert.status}
          </span>
        </div>
        <p className="text-[10px] text-aman-gray mt-0.5 font-medium">
          {alert.loc} <span className="mx-1 opacity-40">·</span> Conf: {alert.conf}%
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-[9px] text-aman-gray font-mono">{alert.cam}</p>
        <p className="text-[9px] text-aman-teal mt-0.5 font-bold tracking-wider">{alert.time}</p>
      </div>
    </div>
  );
};

export default AlertItem;