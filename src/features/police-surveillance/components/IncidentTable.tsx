type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
type Status = 'DISPATCHED' | 'OPEN' | 'RESOLVED';

interface Incident {
  id: string;
  time: string;
  type: string;
  priority: Priority;
  location: string;
  subLoc: string;
  weapon: string;
  reportedBy: string;
  status: Status;
}

const INCIDENTS_DATA: Incident[] = [
  { id: "EV-2399", time: "23:51", type: "Suspect Spotted", priority: "HIGH", location: "North Bridge Junction", subLoc: "North Bridge", weapon: "None", reportedBy: "CAM-002 / Patrol Pt", status: "DISPATCHED" },
  { id: "EV-2398", time: "23:39", type: "Vehicle Theft", priority: "HIGH", location: "Central Market Plaza", subLoc: "Central", weapon: "None", reportedBy: "CAM-019 / Citizen AI", status: "OPEN" },
  { id: "EV-2395", time: "22:31", type: "License Plate Flagged", priority: "MEDIUM", location: "Central Market Plaza", subLoc: "Central", weapon: "None", reportedBy: "CAM-019 / AI System", status: "OPEN" },
  { id: "EV-2394", time: "21:47", type: "Trespassing", priority: "LOW", location: "Downtown Core", subLoc: "Downtown", weapon: "None", reportedBy: "Security Guard / Call", status: "RESOLVED" },
  { id: "EV-2393", time: "21:03", type: "Gunshots Reported", priority: "CRITICAL", location: "East Side - Block 7", subLoc: "East Side", weapon: "Firearm", reportedBy: "Multiple Citizen Calls", status: "RESOLVED" },
];

const PRIORITY_STYLES: Record<Priority, string> = {
  CRITICAL: "bg-aman-red/10 text-aman-red border-aman-red/40",
  HIGH: "bg-aman-orange/10 text-aman-orange border-aman-orange/40",
  MEDIUM: "bg-aman-cyan/10 text-aman-cyan border-aman-cyan/40",
  LOW: "bg-aman-green/10 text-aman-green border-aman-green/40",
};

const STATUS_COLORS: Record<Status, string> = {
  DISPATCHED: "text-aman-orange",
  OPEN: "text-aman-red",
  RESOLVED: "text-aman-green",
};

const IncidentTable: React.FC = () => {
  return (
    <div className="w-full overflow-hidden font-mono border rounded-lg shadow-2xl border-slate-800 bg-aman-dark">
      
      <div className="flex items-center justify-between px-6 py-4 bg-aman-dark">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest text-aman-white">
          INCIDENT REPORTS 
          <span className="flex items-center gap-1.5 ml-2">
            <span className="w-2 h-2 rounded-full bg-aman-green animate-pulse"></span>
            <span className="text-aman-green text-[10px] font-bold">LIVE FEED</span>
          </span>
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search events..." 
              className="bg-aman-darker border border-slate-700 text-[11px] pl-4 pr-3 py-1.5 rounded w-48 text-slate-300 focus:outline-none focus:border-aman-cyan/50"
            />
          </div>
          <div className="flex gap-1">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
              <button key={f} className="text-[10px] text-slate-400 px-2.5 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-all font-bold tracking-tighter">
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-aman-teal/20 text-slate-400 text-[9px] uppercase tracking-[0.2em] border-y border-slate-800/50">
            <th className="px-6 py-3 font-semibold">Time <span className="opacity-40 ml-1 italic text-[8px]">↑ ▤</span></th>
            <th className="px-6 py-3 font-semibold">Type <span className="opacity-40 ml-1 text-[8px]">▤</span></th>
            <th className="px-6 py-3 font-semibold text-center">Priority <span className="opacity-40 ml-1 text-[8px]">▤</span></th>
            <th className="px-6 py-3 font-semibold">Location <span className="opacity-40 ml-1 text-[8px]">▤</span></th>
            <th className="px-6 py-3 font-semibold">Weapon</th>
            <th className="px-6 py-3 font-semibold">Reported By</th>
            <th className="px-6 py-3 font-semibold text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {INCIDENTS_DATA.map((row, index) => (
            <tr 
              key={row.id} 
              className={`transition-colors border-b border-slate-800/30 group hover:bg-aman-cyan/5
                ${index % 2 === 0 ? 'bg-aman-dark' : 'bg-white/2'} 
              `}
            >
              <td className="px-6 py-4">
                <div className="text-[12px] font-bold text-aman-white">{row.time}</div>
                <div className="text-slate-600 text-[9px] font-medium tracking-tighter">{row.id}</div>
              </td>
              <td className="px-6 py-4 text-slate-400 text-[11px] font-medium italic">
                {row.type}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-block w-20 py-0.5 rounded-full border text-[9px] font-black tracking-widest ${PRIORITY_STYLES[row.priority]}`}>
                  {row.priority}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-slate-600 text-[9px] mb-0.5 font-medium leading-none">{row.location}</div>
                <div className="text-slate-200 text-[11px] font-bold leading-none">{row.subLoc}</div>
              </td>
              <td className="px-6 py-4">
                {row.weapon === "Firearm" ? (
                  <span className="text-aman-orange text-[10px] flex items-center gap-1.5 font-bold italic tracking-tight">
                    <span className="text-[12px]">⚠</span> FIREARM
                  </span>
                ) : (
                  <span className="text-slate-600 text-[10px]">— None</span>
                )}
              </td>
              <td className="px-6 py-4 text-slate-500 text-[10px] font-medium tracking-tight">
                {row.reportedBy}
              </td>
              <td className={`px-6 py-4 text-right text-[10px] font-black tracking-[0.1em] ${STATUS_COLORS[row.status]}`}>
                {row.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;