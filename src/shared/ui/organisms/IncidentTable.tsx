import React from "react";
import { Search } from "lucide-react";

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
];

const PRIORITY_STYLES: Record<Priority, string> = {
  CRITICAL: "border-[#f87171] text-[#f87171] bg-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]", 
  HIGH: "border-[#f87171] text-[#f87171] bg-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]",     
  MEDIUM: "border-[#2dd4bf] text-[#2dd4bf] bg-cyan-500/20 shadow-[0_0_10px_rgba(45,212,191,0.1)]",   
  LOW: "border-[#34d399] text-[#34d399] bg-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]",      
};

const STATUS_COLORS: Record<Status, string> = {
  DISPATCHED: "text-[#fbbf24]",
  OPEN: "text-[#f87171]",
  RESOLVED: "text-[#34d399]",
};

const IncidentTable: React.FC = () => {
  return (
    <div className="w-full overflow-hidden font-mono border rounded-lg shadow-2xl border-white/10 bg-aman-teal">
      
      {/* 1. Header & Filter Bar Section */}
      <div className="flex items-center justify-between px-6 py-5 bg-aman-teal">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest text-white">
          INCIDENT REPORTS 
          <span className="flex items-center gap-1.5 ml-2">
            <span className="w-2 h-2 rounded-full bg-[#4fd1c5] animate-pulse shadow-[0_0_8px_#4fd1c5]"></span>
            <span className="text-[#4fd1c5] text-[10px] font-bold">LIVE FEED</span>
          </span>
        </h3>
        
        <div className="flex items-center gap-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-3.5 h-3.5" />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="bg-black/20 border border-white/10 text-[11px] pl-9 pr-3 py-1.5 rounded w-48 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4fd1c5]/50 transition-all"
            />
          </div>

          {/* Priority Filter Bar */}
          <div className="flex items-center overflow-hidden border rounded bg-black/20 border-white/10">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((filter, idx) => (
              <button 
                key={filter}
                className={`px-3 py-1.5 text-[9px] font-black tracking-widest transition-colors border-r border-white/5 last:border-r-0
                  ${idx === 0 ? 'bg-white/10 text-[#4fd1c5]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Table Section */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-white text-[9px] uppercase tracking-[0.2em] border-y border-white/10">
            <th className="px-6 py-4 font-black">Time <span className="opacity-40 ml-1 italic text-[8px]">↓ ▤</span></th>
            <th className="px-6 py-4 font-black">Type <span className="opacity-40 ml-1 text-[8px]">▤</span></th>
            <th className="px-6 py-4 font-black text-center">Priority <span className="opacity-40 ml-1 text-[8px]">▤</span></th>
            <th className="px-6 py-4 font-black">Location <span className="opacity-40 ml-1 text-[8px]">▤</span></th>
            <th className="px-6 py-4 font-black text-center">Weapon</th>
            <th className="px-6 py-4 font-black">Reported By</th>
            <th className="px-6 py-4 font-black text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {INCIDENTS_DATA.map((row, index) => (
            <tr 
              key={row.id} 
              className={`transition-colors border-b border-white/5 group hover:bg-white/5 ${index % 2 === 0 ? 'bg-aman-teal' : 'bg-black/5'}`}
            >
              <td className="px-6 py-4">
                <div className="text-[12px] font-bold text-white">{row.time}</div>
                <div className="text-white/40 text-[9px] font-medium tracking-tighter">{row.id}</div>
              </td>
              <td className="px-6 py-4 text-white text-[11px] font-bold italic opacity-90 group-hover:opacity-100">
                {row.type}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-block w-20 py-0.5 rounded-full border text-[9px] font-black tracking-widest transition-transform group-hover:scale-105 ${PRIORITY_STYLES[row.priority]}`}>
                  {row.priority}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-white/40 text-[9px] mb-0.5 font-medium leading-none">{row.location}</div>
                <div className="text-white text-[11px] font-black leading-none">{row.subLoc}</div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-white/30 text-[10px]">— None</span>
              </td>
              <td className="px-6 py-4 text-white text-[10px] font-bold tracking-tight opacity-80">
                {row.reportedBy}
              </td>
              <td className={`px-6 py-4 text-right text-[10px] font-black tracking-widest uppercase ${STATUS_COLORS[row.status]}`}>
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