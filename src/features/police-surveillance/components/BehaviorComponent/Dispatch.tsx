import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---
type Severity   = "High" | "Medium" | "Low";
type UnitStatus = "Available" | "Dispatched";

interface PoliceUnit {
  id: string;
  name: string;
  badge: string;
  type: "Officer" | "Car";
  status: UnitStatus;
  assignedTo?: string;
}

interface Incident {
  id: string;
  code: string;
  location: string;
  type: string;
  severity: Severity;
  assignedUnits: string[];
}

interface DispatchState {
  units: PoliceUnit[];
  incidents: Incident[];
}

// --- Mock DB ---
let db: DispatchState = {
  units: [
    { id: "u1", name: "K. Hassan",  badge: "#441", type: "Officer", status: "Available" },
    { id: "u2", name: "M. Samir",   badge: "#228", type: "Officer", status: "Available" },
    { id: "u3", name: "Unit Alpha", badge: "A-01", type: "Car",     status: "Available" },
    { id: "u4", name: "Unit Bravo", badge: "B-03", type: "Car",     status: "Available" },
    { id: "u5", name: "R. Fouad",   badge: "#317", type: "Officer", status: "Available" },
  ],
  incidents: [
    { id: "i1", code: "EVT-7701", location: "Sector A - Entrance", type: "Armed Threat", severity: "High",   assignedUnits: [] },
    { id: "i2", code: "EVT-7702", location: "Sector C - Parking",  type: "Fight",        severity: "Medium", assignedUnits: [] },
    { id: "i3", code: "EVT-7703", location: "East Gate",           type: "Theft",        severity: "High",   assignedUnits: [] },
    { id: "i4", code: "EVT-7704", location: "Main Hall",           type: "Fainting",     severity: "Low",    assignedUnits: [] },
    
  ],
};

// --- API functions ---
const fetchDispatchState = async (): Promise<DispatchState> => {
  await new Promise((r) => setTimeout(r, 300));
  return structuredClone(db);
};

const apiAssignUnit = async ({ unitId, incidentId }: { unitId: string; incidentId: string }) => {
  await new Promise((r) => setTimeout(r, 200));
  db.units     = db.units.map((u) => u.id === unitId ? { ...u, status: "Dispatched", assignedTo: incidentId } : u);
  db.incidents = db.incidents.map((inc) => inc.id === incidentId ? { ...inc, assignedUnits: [...inc.assignedUnits, unitId] } : inc);
};

const apiRecallUnit = async (unitId: string) => {
  await new Promise((r) => setTimeout(r, 200));
  db.units     = db.units.map((u) => u.id === unitId ? { ...u, status: "Available", assignedTo: undefined } : u);
  db.incidents = db.incidents.map((inc) => ({ ...inc, assignedUnits: inc.assignedUnits.filter((id) => id !== unitId) }));
};

// --- Config ---
const severityConfig: Record<Severity, { border: string; bg: string; badge: string; dot: string }> = {
  High:   { border: "border-red-500/40",     bg: "bg-red-500/5",     badge: "bg-red-500/15 text-red-400 border border-red-500/30",         dot: "bg-red-500"     },
  Medium: { border: "border-amber-500/40",   bg: "bg-amber-500/5",   badge: "bg-amber-500/15 text-amber-400 border border-amber-500/30",   dot: "bg-amber-400"   },
  Low:    { border: "border-emerald-500/40", bg: "bg-emerald-500/5", badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30", dot: "bg-emerald-400" },
};

// --- Component ---
export default function DispatchBoard() {
  const queryClient  = useQueryClient();
  const dragRef      = useRef<string | null>(null);
  const [draggingId,     setDraggingId]     = useState<string | null>(null);
  const [overIncidentId, setOverIncidentId] = useState<string | null>(null);
  const [flashId,        setFlashId]        = useState<string | null>(null);

  // ── useQuery ──
  const { data, isLoading } = useQuery({
    queryKey: ["dispatch"],
    queryFn:  fetchDispatchState,
  });

  // ── useMutation: assign ──
  const assignMutation = useMutation({
    mutationFn: apiAssignUnit,
    onMutate: async ({ unitId, incidentId }) => {
      await queryClient.cancelQueries({ queryKey: ["dispatch"] });
      const prev = queryClient.getQueryData<DispatchState>(["dispatch"]);

      // Optimistic update — update cache immediately before API responds
      queryClient.setQueryData<DispatchState>(["dispatch"], (old) => {
        if (!old) return old;
        return {
          units:     old.units.map((u) => u.id === unitId ? { ...u, status: "Dispatched", assignedTo: incidentId } : u),
          incidents: old.incidents.map((inc) => inc.id === incidentId ? { ...inc, assignedUnits: [...inc.assignedUnits, unitId] } : inc),
        };
      });

      setFlashId(incidentId);
      setTimeout(() => setFlashId(null), 900);
      return { prev }; // snapshot for rollback
    },
    onError: (_err, _vars, ctx) => {
      // Rollback on error
      if (ctx?.prev) queryClient.setQueryData(["dispatch"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["dispatch"] }),
  });

  // ── useMutation: recall ──
  const recallMutation = useMutation({
    mutationFn: apiRecallUnit,
    onMutate: async (unitId) => {
      await queryClient.cancelQueries({ queryKey: ["dispatch"] });
      const prev = queryClient.getQueryData<DispatchState>(["dispatch"]);

      queryClient.setQueryData<DispatchState>(["dispatch"], (old) => {
        if (!old) return old;
        return {
          units:     old.units.map((u) => u.id === unitId ? { ...u, status: "Available", assignedTo: undefined } : u),
          incidents: old.incidents.map((inc) => ({ ...inc, assignedUnits: inc.assignedUnits.filter((id) => id !== unitId) })),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["dispatch"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["dispatch"] }),
  });

  // ── Drag handlers ──
  const onDragStart = (unitId: string) => { dragRef.current = unitId; setDraggingId(unitId); };
  const onDragEnd   = () => { dragRef.current = null; setDraggingId(null); setOverIncidentId(null); };
  const onDragOver  = (e: React.DragEvent, incidentId: string) => { e.preventDefault(); setOverIncidentId(incidentId); };
  const onDrop      = (e: React.DragEvent, incidentId: string) => {
    e.preventDefault();
    const unitId = dragRef.current;
    if (!unitId) return;
    assignMutation.mutate({ unitId, incidentId });
    setDraggingId(null);
    setOverIncidentId(null);
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-aman-dark/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-[11px] text-slate-500 tracking-widest">LOADING DISPATCH</p>
        </div>
      </div>
    );
  }

  const units      = data?.units     ?? [];
  const incidents  = data?.incidents ?? [];
  const available  = units.filter((u) => u.status === "Available");
  const dispatched = units.filter((u) => u.status === "Dispatched");

  return (
    <div className=" bg-aman-teal p-6 font-mono">
      <div className="mb-8">
        <p className="text-[10px] tracking-[4px] text-cyan-500/60 mb-1">COMMAND CENTER</p>
        <h1 className="text-lg font-bold text-slate-100 tracking-wider">DISPATCH BOARD</h1>
        <div className="mt-2 h-px bg-gradient-to-r from-cyan-500/30 via-slate-700/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

        {/* ── Units Panel ── */}
        <div>
          <p className="text-[10px] tracking-[3px] text-slate-500 mb-3">
            UNITS — <span className="text-cyan-400">{available.length} AVAILABLE</span>
          </p>

          <div className="flex flex-col gap-2 mb-6">
            {available.length === 0 && (
              <p className="text-[11px] text-slate-600 text-center py-4 border border-dashed border-slate-800 rounded-xl">
                All units dispatched
              </p>
            )}
            {available.map((unit) => (
              <div
                key={unit.id}
                draggable
                onDragStart={() => onDragStart(unit.id)}
                onDragEnd={onDragEnd}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl border cursor-grab active:cursor-grabbing select-none
                  bg-[#0d1b2a] border-slate-700/60 hover:border-cyan-500/40 hover:bg-[#0f2035] transition-all duration-200
                  ${draggingId === unit.id ? "opacity-40 scale-95" : ""}`}
              >
                <div className="flex flex-col gap-0.5 opacity-30 group-hover:opacity-60 transition-opacity">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-0.5">
                      <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                      <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                    </div>
                  ))}
                </div>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm">
                  {unit.type === "Car" ? "🚔" : "👮"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200">{unit.name}</p>
                  <p className="text-[10px] text-slate-500">Badge {unit.badge} · {unit.type}</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-widest">
                  READY
                </span>
              </div>
            ))}
          </div>

          {dispatched.length > 0 && (
            <>
              <p className="text-[10px] tracking-[3px] text-slate-500 mb-3">
                DISPATCHED — <span className="text-red-400">{dispatched.length}</span>
              </p>
              <div className="flex flex-col gap-2">
                {dispatched.map((unit) => (
                  <div key={unit.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-800 bg-[#0a1220] opacity-70">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-sm">
                      {unit.type === "Car" ? "🚔" : "👮"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-400">{unit.name}</p>
                      <p className="text-[10px] text-slate-600">Badge {unit.badge}</p>
                    </div>
                    <button
                      onClick={() => recallMutation.mutate(unit.id)}
                      disabled={recallMutation.isPending}
                      className="text-[9px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700 tracking-widest transition-colors disabled:opacity-40"
                    >
                      RECALL
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Incidents Panel ── */}
        <div>
          <p className="text-[10px] tracking-[3px] text-slate-500 mb-3">ACTIVE INCIDENTS</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {incidents.map((inc) => {
              const s        = severityConfig[inc.severity];
              const isOver   = overIncidentId === inc.id;
              const isFlash  = flashId === inc.id;
              const assigned = units.filter((u) => inc.assignedUnits.includes(u.id));

              return (
                <div
                  key={inc.id}
                  onDragOver={(e) => onDragOver(e, inc.id)}
                  onDragLeave={() => setOverIncidentId(null)}
                  onDrop={(e) => onDrop(e, inc.id)}
                  className={`relative rounded-xl border p-4 transition-all duration-200
                    ${s.border} ${s.bg}
                    ${isOver  ? "ring-2 ring-cyan-400/60 border-cyan-400/60 scale-[1.02]" : ""}
                    ${isFlash ? "ring-2 ring-emerald-400/50" : ""}`}
                >
                  {isOver && (
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center pointer-events-none">
                      <span className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg px-3 py-1.5 text-[10px] text-cyan-400 tracking-widest font-bold">
                        DROP TO ASSIGN
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full tracking-widest ${s.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${inc.severity === "High" ? "animate-pulse" : ""}`} />
                      {inc.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500">{inc.code}</span>
                  </div>

                  <p className="text-sm font-bold text-slate-100 mb-0.5">{inc.type}</p>
                  <p className="text-[11px] text-slate-400 mb-3">{inc.location}</p>

                  {assigned.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-700/40">
                      {assigned.map((u) => (
                        <span key={u.id} className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                          {u.type === "Car" ? "🚔" : "👮"} {u.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className={`pt-3 border-t border-dashed ${isOver ? "border-cyan-500/40" : "border-slate-700/40"} transition-colors`}>
                      <p className={`text-[10px] tracking-widest ${isOver ? "text-cyan-400" : "text-slate-600"} transition-colors`}>
                        {isOver ? "↓ RELEASE TO ASSIGN" : "DRAG UNIT HERE"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}