import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShieldAlert, Search, Activity, CheckCircle2, Zap } from "lucide-react";
import AmanAssistantDesign from "./AiAssistant";

// --- Interfaces ---
interface BehaviorIncident {
  id: string;
  time: string;
  location: string;
  type: "Fight" | "Theft" | "Fainting" | "Normal";
  severity: "High" | "Medium" | "Low";
  response: "Active" | "Resolved" | "Dispatched";
}

const MOCK_DATA: BehaviorIncident[] = [
  { id: "EVT-7701", time: "14:35:10", location: "Sector A - Entrance", type: "Theft",    severity: "High",   response: "Active"     },
  { id: "EVT-7702", time: "14:40:22", location: "Sector C - Parking",  type: "Fight",    severity: "Medium", response: "Resolved"   },
  { id: "EVT-7703", time: "14:42:05", location: "Main Hall",           type: "Fainting", severity: "Low",    response: "Resolved"   },
  { id: "EVT-7704", time: "14:45:15", location: "East Gate",           type: "Theft",    severity: "High",   response: "Active"     },
];

const fetchIncidents = async (type: string, severity: string, response: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_DATA.filter((item) => {
    const matchesType     = type     === "All" || item.type     === type;
    const matchesSeverity = severity === "All" || item.severity === severity;
    const matchesResponse = response === "All" || item.response === response;
    return matchesType && matchesSeverity && matchesResponse;
  });
};

// --- Badge configs ---
const severityConfig = {
  High:   { dot: "bg-red-500",     badge: "bg-red-500/10 text-red-400 border border-red-500/20"     },
  Medium: { dot: "bg-amber-400",   badge: "bg-amber-400/10 text-amber-400 border border-amber-400/20" },
  Low:    { dot: "bg-emerald-400", badge: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" },
};

const responseConfig = {
  Active:     { dot: "bg-red-500 animate-pulse", badge: "bg-red-500/10 text-red-400 border border-red-500/20"         },
  Resolved:   { dot: "bg-emerald-400",           badge: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" },
  Dispatched: { dot: "bg-amber-400",             badge: "bg-amber-400/10 text-amber-400 border border-amber-400/20"   },
};

const typeIcons: Record<string, React.ReactNode> = {
  Fight:    <Zap size={16} className="text-aman-blue" />,        
  Theft:    <Search size={16} className="text-aman-white" />,     
  Fainting: <Activity size={16} className="text-aman-white "/>, 
  Normal:   <CheckCircle2 size={16} className="text-aman-light" />,
};

const selectClass =
  "bg-[#0d1b2a] hover:bg-[#112233] border border-slate-700/60 text-slate-300 rounded-lg px-3 py-1.5 text-xs cursor-pointer focus:outline-none focus:border-cyan-500/50 transition-colors";

export default function BehaviorTable() {
  const [typeFilter,     setTypeFilter]     = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [responseFilter, setResponseFilter] = useState("All");

  const { data: incidents, isLoading } = useQuery({
    queryKey: ["incidents", typeFilter, severityFilter, responseFilter],
    queryFn:  () => fetchIncidents(typeFilter, severityFilter, responseFilter),
  });

  return (
    <div className="bg-aman-teal p-6 rounded-2xl border border-slate-800/80 shadow-xl shadow-black/30">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-xs tracking-[3px] text-aman-light/50 uppercase mb-1 font-mono">Live Monitoring</p>
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide">Behavior Incident Report</h2>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <select className={selectClass} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Fight">Fight</option>
            <option value="Theft">Theft</option>
            <option value="Fainting">Fainting</option>
          </select>

          <select className={selectClass} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="All">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select className={selectClass} onChange={(e) => setResponseFilter(e.target.value)}>
            <option value="All">All Responses</option>
            <option value="Active">Active</option>
            <option value="Resolved">Resolved</option>
            <option value="Dispatched">Dispatched</option>
          </select>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-aman-blue/20 via-slate-700/40 to-transparent mb-5" />

      {/* Table */}
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-[10px] tracking-[2px] text-slate-500 uppercase">
            <th className="pb-4 font-medium">Event ID</th>
            <th className="pb-4 font-medium">Time</th>
            <th className="pb-4 font-medium">Location</th>
            <th className="pb-4 font-medium">Type</th>
            <th className="pb-4 font-medium">Severity</th>
            <th className="pb-4 font-medium">Response</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  <span className="text-slate-500 text-[11px] tracking-widest">LOADING</span>
                </div>
              </td>
            </tr>
          ) : incidents?.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12 text-slate-600 text-[11px] tracking-widest">
                NO INCIDENTS FOUND
              </td>
            </tr>
          ) : (
            incidents?.map((incident, idx) => {
                //dot classes
              const sev = severityConfig[incident.severity];
              const res = responseConfig[incident.response];
              return (
                <tr
                  key={incident.id}
                  className="group border-t border-slate-800/50 hover:bg-white/[0.02] transition-colors"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* ID */}
                  <td className="py-4 pr-4">
                    <span className="font-mono text-aman-blue text-[11px] tracking-wider">{incident.id}</span>
                  </td>

                  {/* Time */}
                  <td className="py-4 pr-4">
                    <span className="font-mono text-slate-400 text-[11px]">{incident.time}</span>
                  </td>

                  {/* Location */}
                  <td className="py-4 pr-4 max-w-[140px]">
                    <span className="text-slate-300 truncate block">{incident.location}</span>
                  </td>

                  {/* Type */}
                  <td className="py-4 pr-4">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-base leading-none">{typeIcons[incident.type] ?? "•"}</span>
                      {incident.type}
                    </span>
                  </td>

                  {/* Severity */}
                  <td className="py-4 pr-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ${sev.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                      {incident.severity}
                    </span>
                  </td>

                  {/* Response */}
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ${res.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${res.dot}`} />
                      {incident.response}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Footer */}
      {!isLoading && incidents && incidents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center">
          <span className="text-[10px] text-slate-600 tracking-widest font-mono">
            {incidents.length} INCIDENT{incidents.length !== 1 ? "S" : ""} DISPLAYED
          </span>
          <span className="text-[10px] text-slate-600 font-mono">LIVE</span>
        </div>
      )}
      <AmanAssistantDesign 
        setType={setTypeFilter}
        setSeverity={setSeverityFilter} 
      />
    </div>
  );
}